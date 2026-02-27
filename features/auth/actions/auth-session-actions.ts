"use server";

import { cookies } from "next/headers";
import { AUTH_ROLE_COOKIE, type UserRole } from "@/lib/auth/session-config";

type CreateMockSessionInput = {
  identifier: string;
};

type SessionActionResult = {
  role: UserRole;
  redirectTo: string;
  token: string;
  message: string;
};

function inferRoleFromIdentifier(identifier: string): UserRole {
  const normalizedIdentifier = identifier.toLowerCase();

  if (normalizedIdentifier.includes("admin")) {
    return "admin";
  }

  if (normalizedIdentifier.includes("supervisor")) {
    return "supervisor";
  }

  return "student";
}

function getRoleRedirect(role: UserRole) {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "supervisor") {
    return "/supervisor";
  }

  return "/student";
}

export async function createMockSessionAction({
  identifier,
}: CreateMockSessionInput): Promise<SessionActionResult> {
  const role = inferRoleFromIdentifier(identifier);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_ROLE_COOKIE, role, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return {
    role,
    redirectTo: getRoleRedirect(role),
    token: `mock-token-${role}`,
    message: `Dummy ${role} session created. Redirecting to the ${role} workspace.`,
  };
}

export async function clearMockSessionAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_ROLE_COOKIE);
}
