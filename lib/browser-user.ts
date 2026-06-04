import { cookies, headers } from "next/headers";
import {
  BROWSER_USER_COOKIE,
  BROWSER_USER_HEADER,
} from "@/lib/browser-user.constants";

export {
  BROWSER_USER_COOKIE,
  BROWSER_USER_HEADER,
  browserUserCookieOptions,
  COOKIE_MAX_AGE,
} from "@/lib/browser-user.constants";

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
