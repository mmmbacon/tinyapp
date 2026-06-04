/**
 * Applies drizzle/migrations/*.sql via node-postgres.
 * Tracks applied migrations so re-runs are safe on existing databases.
 */
import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: join(__dirname, "..", ".env.local") });
config({ path: join(__dirname, "..", ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to .env or .env.local");
  process.exit(1);
}

const migrationsDir = join(__dirname, "..", "drizzle", "migrations");
const migrationFiles = readdirSync(migrationsDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

function statementsFromFile(path) {
  const raw = readFileSync(path, "utf8");
  return raw
    .split(/--> statement-breakpoint\s*/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function ensureMigrationsTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _tinyapp_migrations (
      id serial PRIMARY KEY,
      filename varchar(255) NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function isApplied(filename) {
  const result = await client.query(
    "SELECT 1 FROM _tinyapp_migrations WHERE filename = $1 LIMIT 1",
    [filename]
  );
  return result.rowCount > 0;
}

async function markApplied(filename) {
  await client.query(
    "INSERT INTO _tinyapp_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING",
    [filename]
  );
}

async function bootstrapExistingSchema() {
  const initialMigration = "0000_initial.sql";
  if (await isApplied(initialMigration)) {
    return;
  }

  const result = await client.query(
    "SELECT to_regclass('public.users') AS users_table"
  );
  if (result.rows[0]?.users_table) {
    await markApplied(initialMigration);
    console.log(`  ${initialMigration} (already present, marked applied)`);
  }
}

try {
  await client.connect();
  console.log("Connected. Applying schema…");
  await ensureMigrationsTable();
  await bootstrapExistingSchema();

  let appliedCount = 0;

  for (const file of migrationFiles) {
    if (await isApplied(file)) {
      console.log(`  ${file} (skip)`);
      continue;
    }

    console.log(`  ${file}`);
    for (const sql of statementsFromFile(join(migrationsDir, file))) {
      await client.query(sql);
    }
    await markApplied(file);
    appliedCount += 1;
  }

  if (appliedCount === 0) {
    console.log("Database is up to date.");
  } else {
    console.log(`Applied ${appliedCount} migration(s).`);
  }
} catch (err) {
  console.error("Failed to apply schema:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
