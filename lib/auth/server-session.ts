import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_ROLE_COOKIE,
  getRequiredRoleForPath,
  getRoleHome,
  parseUserRole,
  type UserRole,
} from "@/lib/auth/session-config";

export async function getServerSessionRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  return parseUserRole(cookieStore.get(AUTH_ROLE_COOKIE)?.value);
}

export async function requireRole(requiredRole: UserRole) {
  const role = await getServerSessionRole();

  if (!role) {
    redirect("/auth/login");
  }

  if (role !== requiredRole) {
    redirect(getRoleHome(role));
  }

  return role;
}

export async function requireRoleForPath(pathname: string) {
  const requiredRole = getRequiredRoleForPath(pathname);

  if (!requiredRole) {
    return null;
  }

  return requireRole(requiredRole);
}
