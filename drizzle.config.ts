import { neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import ws from "ws";

// drizzle-kit runs outside Next.js — load env explicitly
config({ path: ".env.local" });
config({ path: ".env" });

// HTTP mode avoids WebSocket hangs; ws is fallback for drizzle-kit introspection
neonConfig.poolQueryViaFetch = true;
neonConfig.webSocketConstructor = ws;

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
