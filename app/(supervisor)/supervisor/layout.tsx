import type { ReactNode } from "react";
import { AppShell } from "@/features/layout/components/app-shell";
import { roleNavigation } from "@/features/layout/config/navigation";
import { requireRole } from "@/lib/auth/server-session";

export default async function SupervisorLayout({ children }: { children: ReactNode }) {
  await requireRole("supervisor");

  return (
    <AppShell
      roleLabel="Supervisor Portal"
      title="Supervisor workspace"
      description="Search students, review placement context, and submit supervision scores."
      navigation={roleNavigation.supervisor}
    >
      {children}
    </AppShell>
  );
}
