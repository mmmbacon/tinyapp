import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  BROWSER_USER_COOKIE,
  BROWSER_USER_HEADER,
  browserUserCookieOptions,
} from "@/lib/browser-user.constants";

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(BROWSER_USER_COOKIE)?.value?.trim();
  const token = existing || crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(BROWSER_USER_HEADER, token);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!existing) {
    response.cookies.set(
      BROWSER_USER_COOKIE,
      token,
      browserUserCookieOptions()
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
