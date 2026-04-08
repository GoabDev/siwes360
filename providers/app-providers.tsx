"use client";

import type { ReactNode } from "react";
import type { UserRole } from "@/lib/auth/session-config";
import { AuthSessionProvider } from "@/providers/auth-session-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";

type AppProvidersProps = {
  children: ReactNode;
  initialRole: UserRole | null;
};

export function AppProviders({ children, initialRole }: AppProvidersProps) {
  return (
    <AuthSessionProvider initialRole={initialRole}>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </AuthSessionProvider>
  );
}
