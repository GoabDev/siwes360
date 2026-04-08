"use client";

import type { UserRole } from "@/lib/auth/session-config";

type SessionSnapshot = {
  role: UserRole | null;
};

const listeners = new Set<() => void>();
let cachedSessionSnapshot: SessionSnapshot = {
  role: null,
};

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function initializeSession(role: UserRole | null) {
  cachedSessionSnapshot = {
    role,
  };
}

export function persistSession(role: UserRole) {
  cachedSessionSnapshot = {
    role,
  };
  emitChange();
}

export function clearSession() {
  cachedSessionSnapshot = {
    role: null,
  };
  emitChange();
}

export function getSessionSnapshot(): SessionSnapshot {
  return cachedSessionSnapshot;
}

export function getServerSessionSnapshot(): SessionSnapshot {
  return cachedSessionSnapshot;
}

export function subscribeToSession(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
