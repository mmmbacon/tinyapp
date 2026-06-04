import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { urls } from "@/drizzle/schema";
import { generateShortCode } from "@/lib/short-code";

const MAX_SHORT_CODE_ATTEMPTS = 8;

export async function createUrl(longUrl: string, userId: number) {
  const trimmed = longUrl?.trim();
  if (!trimmed) {
    throw new Error("A long URL must be provided.");
  }

  for (let attempt = 0; attempt < MAX_SHORT_CODE_ATTEMPTS; attempt++) {
    const shortUrl = generateShortCode();
    try {
      const inserted = await db
        .insert(urls)
        .values({
          longUrl: trimmed,
          shortUrl,
          userId,
        })
        .returning({
          shortUrl: urls.shortUrl,
          longUrl: urls.longUrl,
        });
      return inserted[0];
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes("unique") && !message.includes("duplicate")) {
        throw err;
      }
    }
  }

  throw new Error("Could not generate a unique short URL");
}

export async function getUrlsForUser(userId: number) {
  return db
    .select({
      shortUrl: urls.shortUrl,
      longUrl: urls.longUrl,
    })
    .from(urls)
    .where(eq(urls.userId, userId));
}

export async function getUrlForUser(shortUrl: string, userId: number) {
  const rows = await db
    .select({
      shortUrl: urls.shortUrl,
      longUrl: urls.longUrl,
    })
    .from(urls)
    .where(and(eq(urls.shortUrl, shortUrl), eq(urls.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getUrlForRedirect(shortUrl: string) {
  const rows = await db
    .select({ longUrl: urls.longUrl })
    .from(urls)
    .where(eq(urls.shortUrl, shortUrl))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateUrl(
  shortUrl: string,
  userId: number,
  longUrl: string
) {
  const trimmed = longUrl?.trim();
  if (!trimmed) {
    throw new Error("A long URL must be provided.");
  }

  const updated = await db
    .update(urls)
    .set({ longUrl: trimmed })
    .where(and(eq(urls.shortUrl, shortUrl), eq(urls.userId, userId)))
    .returning({
      shortUrl: urls.shortUrl,
      longUrl: urls.longUrl,
    });

  if (!updated[0]) {
    throw new Error("URL not found");
  }
  return updated[0];
}

export async function deleteUrl(shortUrl: string, userId: number) {
  const deleted = await db
    .delete(urls)
    .where(and(eq(urls.shortUrl, shortUrl), eq(urls.userId, userId)))
    .returning({ shortUrl: urls.shortUrl });

  if (!deleted[0]) {
    throw new Error("URL not found");
  }
}
