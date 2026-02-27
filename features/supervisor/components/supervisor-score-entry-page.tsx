"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SupervisorScoreEntryForm } from "@/features/supervisor/components/supervisor-score-entry-form";

type SupervisorScoreEntryPageViewProps = {
  matricNumber: string;
};

export function SupervisorScoreEntryPageView({
  matricNumber,
}: SupervisorScoreEntryPageViewProps) {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Score entry"
        title="Submit a supervision score with the student record in view"
        description="This route is structured for safe scoring and will later rely on backend validation for duplicate submission policies."
      />
      <SupervisorScoreEntryForm matricNumber={decodeURIComponent(matricNumber)} />
    </section>
  );
}
