"use client";

import {
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_STORAGE_KEY,
  parseUserRole,
  type UserRole,
} from "@/lib/auth/session-config";

type SessionSnapshot = {
  role: UserRole | null;
  token: string | null;
};

const listeners = new Set<() => void>();
const emptySessionSnapshot: SessionSnapshot = {
  role: null,
  token: null,
};
let cachedSessionSnapshot: SessionSnapshot = emptySessionSnapshot;

function getCookieValue(name: string) {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie?.split("=")[1] ?? null;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function persistSession(role: UserRole, token?: string) {
  document.cookie = `${AUTH_ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  emitChange();
}

export function clearSession() {
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  emitChange();
}

export function getStoredSession(): SessionSnapshot {
  const role = parseUserRole(getCookieValue(AUTH_ROLE_COOKIE));
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  return {
    role,
    token,
  };
}

export function getSessionSnapshot(): SessionSnapshot {
  if (typeof window === "undefined") {
    return emptySessionSnapshot;
  }

  const nextSnapshot = getStoredSession();

  if (
    cachedSessionSnapshot.role === nextSnapshot.role &&
    cachedSessionSnapshot.token === nextSnapshot.token
  ) {
    return cachedSessionSnapshot;
  }

  cachedSessionSnapshot = nextSnapshot;
  return cachedSessionSnapshot;
}

export function getServerSessionSnapshot(): SessionSnapshot {
  return emptySessionSnapshot;
}

export function subscribeToSession(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
