import { NextResponse } from "next/server";

export function middleware(req: { cookies: { get: (arg0: string) => { (): any; new(): any; value: null; }; }; nextUrl: { pathname: string; }; url: string | URL | undefined; }) {
  const token = req.cookies.get("jwt")?.value || null;

  // Public routes
  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
