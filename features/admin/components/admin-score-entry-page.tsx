"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminScoreEntryForm } from "@/features/admin/components/admin-score-entry-form";

type AdminScoreEntryPageViewProps = {
  matricNumber: string;
};

export function AdminScoreEntryPageView({ matricNumber }: AdminScoreEntryPageViewProps) {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Score entry"
        title="Enter logbook and presentation scores"
        description="Use this page to complete the remaining scores for a student."
      />
      <AdminScoreEntryForm matricNumber={decodeURIComponent(matricNumber)} />
    </section>
  );
}
