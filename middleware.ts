import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip static files, API routes, and already-routed paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/pintatec") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If request comes from pintatec domain → serve Pintatec page
  const isPintatec =
    hostname.includes("pintatec") ||
    hostname.startsWith("pintatec.");

  if (isPintatec) {
    return NextResponse.rewrite(new URL("/pintatec", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
