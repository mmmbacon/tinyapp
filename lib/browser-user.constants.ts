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
