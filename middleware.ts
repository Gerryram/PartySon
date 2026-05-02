import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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

  // Each Vercel project sets BRAND in environment variables:
  //   BRAND=partyson  → partyson.vercel.app
  //   BRAND=pintatec  → pintatec2.vercel.app
  //   BRAND=casatec   → casatec.vercel.app (default)
  const brand = process.env.BRAND;

  if (brand === "partyson") {
    return NextResponse.rewrite(new URL("/partyson", request.url));
  }

  if (brand === "pintatec") {
    return NextResponse.rewrite(new URL("/pintatec", request.url));
  }

  // casatec or no BRAND set → main Casatec app
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
