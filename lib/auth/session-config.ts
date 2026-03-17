export type UserRole = "student" | "supervisor" | "admin";

export const AUTH_ROLE_COOKIE = "siwes360-role";
export const AUTH_TOKEN_STORAGE_KEY = "siwes360-access-token";
export const AUTH_REFRESH_TOKEN_STORAGE_KEY = "siwes360-refresh-token";
export const AUTH_PROTECTED_PREFIXES = ["/student", "/supervisor", "/admin"] as const;
export const AUTH_ALLOWED_WHEN_AUTHENTICATED = ["/auth/logout"] as const;

const roleHomeMap: Record<UserRole, string> = {
  student: "/student",
  supervisor: "/supervisor",
  admin: "/admin",
};

export function parseUserRole(value?: string | null): UserRole | null {
  if (value === "student" || value === "supervisor" || value === "admin") {
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
