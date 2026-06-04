/**
 * Applies drizzle/migrations/0000_initial.sql via node-postgres.
 * More reliable than drizzle-kit push + Neon WebSockets on Windows.
 */
import { readFileSync } from "fs";
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

const migrationPath = join(
  __dirname,
  "..",
  "drizzle",
  "migrations",
  "0000_initial.sql"
);
const raw = readFileSync(migrationPath, "utf8");
const statements = raw
  .split(/--> statement-breakpoint\s*/g)
  .map((s) => s.trim())
  .filter(Boolean);

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

try {
  await client.connect();
  console.log("Connected. Applying schema…");
  for (const sql of statements) {
    await client.query(sql);
  }
  console.log("Schema applied successfully.");
} catch (err) {
  console.error("Failed to apply schema:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
