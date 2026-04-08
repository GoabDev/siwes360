"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminScoreEntryForm } from "@/features/admin/components/admin-score-entry-form";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminScoreEntryPageViewProps = {
  matricNumber: string;
  scope?: AdminWorkspaceScope;
};

export function AdminScoreEntryPageView({
  matricNumber,
  scope = "department",
}: AdminScoreEntryPageViewProps) {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Score entry"
        title="Enter logbook and presentation scores"
        description="Use this page to complete the remaining scores for a student."
      />
      <AdminScoreEntryForm matricNumber={decodeURIComponent(matricNumber)} scope={scope} />
    </section>
  );
}
