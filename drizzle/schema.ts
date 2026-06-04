import {
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  browserToken: varchar("browser_token", { length: 64 }).unique(),
});

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  shortUrl: varchar("short_url", { length: 32 }).notNull().unique(),
  longUrl: varchar("long_url", { length: 2048 }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type User = typeof users.$inferSelect;
export type Url = typeof urls.$inferSelect;
