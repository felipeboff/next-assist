import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Routes of the (public) group: reachable without a session cookie.
const PUBLIC_PATHS = ["/login"];

/**
 * Optimistic check only: no session cookie means the visitor goes to the login page.
 * Pages still verify the session against the database (requireUser in app/(protected)).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isPublic && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
