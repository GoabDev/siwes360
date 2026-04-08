export type UserRole = "student" | "supervisor" | "admin" | "superadmin";

export const AUTH_ROLE_COOKIE = "siwes360-role";
export const AUTH_ACCESS_COOKIE = "siwes360-access-token";
export const AUTH_REFRESH_COOKIE = "siwes360-refresh-token";
export const AUTH_PROTECTED_PREFIXES = ["/student", "/supervisor", "/admin", "/superadmin"] as const;
export const AUTH_ALLOWED_WHEN_AUTHENTICATED = ["/auth/logout"] as const;

const roleHomeMap: Record<UserRole, string> = {
  student: "/student",
  supervisor: "/supervisor",
  admin: "/admin",
  superadmin: "/superadmin",
};

export function parseUserRole(value?: string | null): UserRole | null {
  if (
    value === "student" ||
    value === "supervisor" ||
    value === "admin" ||
    value === "superadmin"
  ) {
    return value;
  }

  return null;
}

export function getRoleHome(role: UserRole) {
  return roleHomeMap[role];
}

export function getRequiredRoleForPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/student")) {
    return "student";
  }

  if (pathname.startsWith("/supervisor")) {
    return "supervisor";
  }

  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  if (pathname.startsWith("/superadmin")) {
    return "superadmin";
  }

  return null;
}

export function isProtectedPath(pathname: string) {
  return AUTH_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isAuthPath(pathname: string) {
  return pathname.startsWith("/auth");
}

export function isAuthPathAllowedWhenAuthenticated(pathname: string) {
  return AUTH_ALLOWED_WHEN_AUTHENTICATED.some((path) => pathname.startsWith(path));
}
