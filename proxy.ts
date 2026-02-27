import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_ROLE_COOKIE,
  getRequiredRoleForPath,
  getRoleHome,
  isAuthPath,
  isProtectedPath,
  parseUserRole,
} from "@/lib/auth/session-config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = parseUserRole(request.cookies.get(AUTH_ROLE_COOKIE)?.value);

  if (isAuthPath(pathname) && role) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const requiredRole = getRequiredRoleForPath(pathname);

  if (requiredRole && role !== requiredRole) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/student/:path*",
    "/supervisor/:path*",
    "/admin/:path*",
  ],
};
