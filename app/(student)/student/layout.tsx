import type { ReactNode } from "react";
import { AppShell } from "@/features/layout/components/app-shell";
import { roleNavigation } from "@/features/layout/config/navigation";
import { requireRole } from "@/lib/auth/server-session";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireRole("student");

  return (
    <AppShell
      roleLabel="Student Portal"
      title="Student workspace"
      description="Manage profile setup, report upload, and grading visibility."
      navigation={roleNavigation.student}
    >
      {children}
    </AppShell>
  );
}
