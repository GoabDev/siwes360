"use server";

import { cookies } from "next/headers";
import {
  AUTH_ALLOWED_WHEN_AUTHENTICATED,
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  AUTH_ROLE_COOKIE,
  type UserRole,
} from "@/lib/auth/session-config";

function getSessionCookieOptions(maxAge = 60 * 60 * 8) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function createMockSessionAction(role: UserRole) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_ROLE_COOKIE, role, getSessionCookieOptions());

  return {
    role,
    allowedPaths: AUTH_ALLOWED_WHEN_AUTHENTICATED,
  };
}

export async function clearSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_ROLE_COOKIE);
  cookieStore.delete(AUTH_ACCESS_COOKIE);
  cookieStore.delete(AUTH_REFRESH_COOKIE);
}
