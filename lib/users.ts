import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { hashPassword } from "@/lib/password";

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
