ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "browser_token" varchar(64);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_browser_token_unique" ON "users" ("browser_token");
