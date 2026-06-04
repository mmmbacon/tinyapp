import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { hashPassword } from "@/lib/password";
import { getBrowserToken } from "@/lib/browser-user";

export async function getUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0] ?? null;
}

export async function getUserById(id: number) {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getUserByBrowserToken(token: string) {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.browserToken, token))
    .limit(1);
  return rows[0] ?? null;
}

export async function createBrowserUser(token: string): Promise<number> {
  const hashed = await hashPassword(crypto.randomUUID());
  const inserted = await db
    .insert(users)
    .values({
      email: `browser-${token}@tinyapp.local`,
      password: hashed,
      browserToken: token,
    })
    .returning({ id: users.id });

  return inserted[0].id;
}

export async function getOrCreateBrowserUserId(): Promise<number> {
  const token = await getBrowserToken();
  if (!token) {
    throw new Error("Browser session token is missing");
  }

  const user = await getUserByBrowserToken(token);
  if (user) {
    return user.id;
  }

  return createBrowserUser(token);
}

export async function createUser(
  email: string,
  password: string
): Promise<{ id: number; email: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Email is already registered");
  }

  const hashed = await hashPassword(password);
  const inserted = await db
    .insert(users)
    .values({ email: normalizedEmail, password: hashed })
    .returning({ id: users.id, email: users.email });

  return inserted[0];
}
