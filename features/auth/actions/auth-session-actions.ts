"use server";

import { cookies } from "next/headers";
import {
  AUTH_ROLE_COOKIE,
  getRoleHome,
  type UserRole,
} from "@/lib/auth/session-config";

type CreateSessionInput = {
  role: UserRole;
  token?: string;
  refreshToken?: string;
};

type SessionActionResult = {
  role: UserRole;
  redirectTo: string;
  token: string;
  refreshToken: string;
  message: string;
};

export async function createSessionAction({
  role,
  token,
  refreshToken,
}: CreateSessionInput): Promise<SessionActionResult> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_ROLE_COOKIE, role, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return {
    role,
    redirectTo: getRoleHome(role),
    token: token ?? "",
    refreshToken: refreshToken ?? "",
    message: `${role} session created.`,
  };
}

export async function clearSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_ROLE_COOKIE);
}
