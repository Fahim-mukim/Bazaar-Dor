import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const signInUrl = new URL("/signin", request.url);

    const callbackUrl =
      request.nextUrl.pathname + request.nextUrl.search;

    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    signInUrl.searchParams.set("message", "unauthorized");

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};