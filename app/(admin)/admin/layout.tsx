import type { ReactNode } from "react";
import { AppShell } from "@/features/layout/components/app-shell";
import { roleNavigation } from "@/features/layout/config/navigation";
import { requireRole } from "@/lib/auth/server-session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole("admin");

  return (
    <AppShell
      roleLabel="Department Admin Portal"
      title="Admin workspace"
      description="Manage departmental grading, monitor students, and coordinate score completion."
      navigation={roleNavigation.admin}
    >
      {children}
    </AppShell>
  );
}
