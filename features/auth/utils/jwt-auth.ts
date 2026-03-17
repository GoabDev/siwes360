import { jwtDecode } from "jwt-decode";
import type { AuthRole } from "@/features/auth/types/auth";

export const authClaims = {
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  nameIdentifier:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
} as const;

type JwtPayload = {
  [authClaims.role]?: string;
  [authClaims.name]?: string;
  [authClaims.nameIdentifier]?: string;
  departmentId?: string;
  departmentName?: string;
  exp?: number;
  iss?: string;
  aud?: string;
};

const EXPIRY_SKEW_SECONDS = 60;

export function normalizeBackendRole(role: string | null | undefined): AuthRole | undefined {
  if (!role) {
    return undefined;
  }

  const normalizedRole = role.trim().toLowerCase();

  if (normalizedRole === "student") {
    return "student";
  }

  if (normalizedRole === "admin" || normalizedRole === "administrator") {
    return "admin";
  }

  if (normalizedRole === "supervisor") {
    return "supervisor";
  }

  return undefined;
}

export function decodeAccessToken(token: string) {
  return jwtDecode<JwtPayload>(token);
}

export function getRoleFromAccessToken(token: string): AuthRole | undefined {
  const payload = decodeAccessToken(token);
  return normalizeBackendRole(payload[authClaims.role]);
}

export function getAccessTokenExpiry(token: string) {
  return decodeAccessToken(token).exp;
}

export function isTokenExpiringSoon(token: string, skewSeconds = EXPIRY_SKEW_SECONDS) {
  const exp = getAccessTokenExpiry(token);

  if (!exp) {
    return true;
  }

  return exp - skewSeconds <= Math.floor(Date.now() / 1000);
}
