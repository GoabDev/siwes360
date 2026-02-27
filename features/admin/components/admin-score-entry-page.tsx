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
        title="Capture logbook and presentation scores for a student"
        description="This route closes the admin side of grading and will later rely on backend authorization and department matching."
      />
      <AdminScoreEntryForm matricNumber={decodeURIComponent(matricNumber)} />
    </section>
  );
}
