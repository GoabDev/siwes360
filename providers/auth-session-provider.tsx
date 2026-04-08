"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserRole } from "@/lib/auth/session-config";
import {
  clearSession,
  initializeSession,
  persistSession,
} from "@/features/auth/utils/mock-session";

type AuthSessionState = {
  role: UserRole | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

type AuthSessionContextValue = AuthSessionState & {
  signIn: (role: UserRole) => void;
  signOut: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
  children: ReactNode;
  initialRole: UserRole | null;
};

export function AuthSessionProvider({ children, initialRole }: AuthSessionProviderProps) {
  const [role, setRole] = useState<UserRole | null>(initialRole);

  useEffect(() => {
    initializeSession(initialRole);
    setRole(initialRole);
  }, [initialRole]);

  const signIn = useCallback((nextRole: UserRole) => {
    persistSession(nextRole);
    setRole(nextRole);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      role,
      isAuthenticated: Boolean(role),
      isHydrated: true,
      signIn,
      signOut,
    }),
    [role, signIn, signOut],
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
