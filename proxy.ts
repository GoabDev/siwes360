import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  AUTH_ROLE_COOKIE,
  isAuthPathAllowedWhenAuthenticated,
  getRequiredRoleForPath,
  getRoleHome,
  isAuthPath,
  isProtectedPath,
  parseUserRole,
} from "@/lib/auth/session-config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = parseUserRole(request.cookies.get(AUTH_ROLE_COOKIE)?.value);
  const hasAccessCookie = Boolean(request.cookies.get(AUTH_ACCESS_COOKIE)?.value);
  const hasRefreshCookie = Boolean(request.cookies.get(AUTH_REFRESH_COOKIE)?.value);
  const hasBackendSessionCookies = hasAccessCookie || hasRefreshCookie;
  const hasConfiguredBackend = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL?.trim());
  const hasSessionCookies = hasConfiguredBackend
    ? hasBackendSessionCookies
    : Boolean(role);

  if (isAuthPath(pathname) && hasSessionCookies && role && !isAuthPathAllowedWhenAuthenticated(pathname)) {
    return NextResponse.redirect(new URL(getRoleHome(role), request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasSessionCookies) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const requiredRole = getRequiredRoleForPath(pathname);

  if (requiredRole && role && role !== requiredRole) {
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
    "/superadmin/:path*",
  ],
};
