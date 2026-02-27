"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { UserRole } from "@/lib/auth/session-config";
import {
  clearSession,
  getSessionSnapshot,
  getServerSessionSnapshot,
  persistSession,
  subscribeToSession,
} from "@/features/auth/utils/mock-session";

type AuthSessionState = {
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

type AuthSessionContextValue = AuthSessionState & {
  signIn: (role: UserRole, token?: string) => void;
  signOut: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const snapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  const signIn = useCallback((role: UserRole, token?: string) => {
    persistSession(role, token);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
  }, []);

  const value = useMemo(
    () => ({
      role: snapshot.role,
      token: snapshot.token,
      isAuthenticated: Boolean(snapshot.role),
      isHydrated: true,
      signIn,
      signOut,
    }),
    [snapshot.role, snapshot.token, signIn, signOut],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider.");
  }

  return context;
}
