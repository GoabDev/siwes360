import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getConfiguredApiOrigin } from "@/lib/api/config";
import {
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  AUTH_ROLE_COOKIE,
  getRequiredRoleForPath,
  getRoleHome,
  parseUserRole,
  type UserRole,
} from "@/lib/auth/session-config";

type CurrentUserResponse = {
  success?: boolean;
  message?: string;
  data?: {
    role?: string | null;
  } | null;
};

type RefreshResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
  accessToken?: string;
  refreshToken?: string;
};

function extractRefreshTokens(payload: RefreshResponse) {
  return {
    accessToken: payload.data?.accessToken ?? payload.accessToken ?? null,
    refreshToken: payload.data?.refreshToken ?? payload.refreshToken ?? null,
  };
}

function normalizeBackendRole(role: string | null | undefined): UserRole | null {
  if (!role) {
    return null;
  }

  const normalized = role.trim().toLowerCase();

  if (normalized === "student") {
    return "student";
  }

  if (normalized === "supervisor") {
    return "supervisor";
  }

  if (normalized === "admin" || normalized === "administrator") {
    return "admin";
  }

  if (normalized === "superadmin" || normalized === "super-admin" || normalized === "super admin") {
    return "superadmin";
  }

  return null;
}

function createBackendUrl(pathname: string) {
  const origin = getConfiguredApiOrigin();

  if (!origin) {
    return null;
  }

  return new URL(pathname, origin);
}

async function getCurrentUserRole(accessToken: string) {
  const url = createBackendUrl("/api/UserProfile/me");

  if (!url) {
    return null;
  }

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as CurrentUserResponse;
  return normalizeBackendRole(payload.data?.role ?? null);
}

async function tryRefreshServerAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_COOKIE)?.value ?? null;
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE)?.value ?? null;
  const url = createBackendUrl("/api/Authentication/refresh");

  if (!accessToken || !refreshToken || !url) {
    return null;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as RefreshResponse;
  const nextTokens = extractRefreshTokens(payload);

  if (!nextTokens.accessToken) {
    return null;
  }

  return nextTokens.accessToken;
}

export async function getServerSessionRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  return parseUserRole(cookieStore.get(AUTH_ROLE_COOKIE)?.value);
}

export async function requireRole(requiredRole: UserRole) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_COOKIE)?.value ?? null;
  const cookieRole = parseUserRole(cookieStore.get(AUTH_ROLE_COOKIE)?.value);

  if (!getConfiguredApiOrigin()) {
    if (!cookieRole) {
      redirect("/auth/login");
    }

    if (cookieRole !== requiredRole) {
      redirect(getRoleHome(cookieRole));
    }

    return cookieRole;
  }

  if (!accessToken) {
    redirect("/auth/login");
  }

  let role = await getCurrentUserRole(accessToken);

  if (!role) {
    const refreshedAccessToken = await tryRefreshServerAccessToken();

    if (refreshedAccessToken) {
      role = await getCurrentUserRole(refreshedAccessToken);
    }
  }

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
