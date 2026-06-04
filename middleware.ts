import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BROWSER_USER_COOKIE = "tinyapp_browser";
const BROWSER_USER_HEADER = "x-tinyapp-browser";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(BROWSER_USER_COOKIE)?.value?.trim();
  const token = existing || crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(BROWSER_USER_HEADER, token);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!existing) {
    response.cookies.set(BROWSER_USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
