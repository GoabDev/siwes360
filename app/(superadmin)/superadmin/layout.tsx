import type { ReactNode } from "react";
import { AppShell } from "@/features/layout/components/app-shell";
import { roleNavigation } from "@/features/layout/config/navigation";
import { requireRole } from "@/lib/auth/server-session";

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  await requireRole("superadmin");

  return (
    <AppShell
      roleLabel="Platform Super Admin Portal"
      title="Super admin workspace"
      description="Oversee global records, department operations, and platform-wide reporting from one workspace."
      navigation={roleNavigation.superadmin}
    >
      {children}
    </AppShell>
  );
}
