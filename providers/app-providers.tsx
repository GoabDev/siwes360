"use client";

import type { ReactNode } from "react";
import { AuthSessionProvider } from "@/providers/auth-session-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthSessionProvider>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </AuthSessionProvider>
  );
}
