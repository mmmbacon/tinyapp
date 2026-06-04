import { cookies, headers } from "next/headers";

export const BROWSER_USER_COOKIE = "tinyapp_browser";
export const BROWSER_USER_HEADER = "x-tinyapp-browser";

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function browserUserCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export async function getBrowserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(BROWSER_USER_COOKIE)?.value?.trim();
  if (fromCookie) {
    return fromCookie;
  }

  const headerStore = await headers();
  const fromHeader = headerStore.get(BROWSER_USER_HEADER)?.trim();
  return fromHeader || null;
}
