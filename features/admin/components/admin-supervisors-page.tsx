"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { AdminSupervisorsTable } from "@/features/admin/components/admin-supervisors-table";
import { InviteSupervisorDialog } from "@/features/admin/components/invite-supervisor-dialog";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminSupervisorsPageViewProps = {
  scope?: AdminWorkspaceScope;
  eyebrow?: string;
  title?: string;
  description?: string;
  sectionLabel?: string;
  sectionTitle?: string;
  sectionDescription?: string;
};

export function AdminSupervisorsPageView({
  scope = "department",
  eyebrow = "Department supervisors",
  title = "Invite and manage supervisor access",
  description = "Track the supervisors attached to departments, send new invitations, and remove access when it is no longer needed.",
  sectionLabel = "Department supervisors",
  sectionTitle = "Manage invited supervisor access",
  sectionDescription = "Review active supervisor accounts, search by department or email, and invite new supervisors without leaving this page.",
}: AdminSupervisorsPageViewProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <SurfaceCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">{sectionLabel}</p>
          <h3 className="mt-1 text-xl font-semibold">{sectionTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {sectionDescription}
          </p>
        </div>
        <Button type="button" onClick={() => setIsInviteOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite supervisor
        </Button>
      </SurfaceCard>
      <AdminSupervisorsTable scope={scope} />
      <InviteSupervisorDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />
    </section>
  );
}
