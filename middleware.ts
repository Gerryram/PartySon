import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip static files, API routes, and already-routed internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/pintatec") ||
    pathname.startsWith("/partyson") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // partyson.* → /partyson (event marketplace)
  if (hostname.includes("partyson")) {
    return NextResponse.rewrite(new URL("/partyson", request.url));
  }

  // pintatec.* → /pintatec (painting subsidiary)
  if (hostname.includes("pintatec")) {
    return NextResponse.rewrite(new URL("/pintatec", request.url));
  }

  // casatec.* (or localhost) → / (main Casatec app)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
