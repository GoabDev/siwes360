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
        title="Enter a supervision score"
        description="Review the student's details and submit the supervision score from this page."
      />
      <SupervisorScoreEntryForm matricNumber={decodeURIComponent(matricNumber)} />
    </section>
  );
}
