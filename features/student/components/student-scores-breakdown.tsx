"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useStudentScoresQuery } from "@/features/student/queries/student-scores-queries";

export function StudentScoresBreakdown() {
  const scoresQuery = useStudentScoresQuery();
  const scores = scoresQuery.data;

  const items = [
    { label: "Report", value: scores?.report, max: 30 },
    { label: "Supervisor", value: scores?.supervisor, max: 10 },
    { label: "Logbook", value: scores?.logbook, max: 30 },
    { label: "Presentation", value: scores?.presentation, max: 30 },
  ];

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Score breakdown"
        title="Monitor every grading component as it becomes available"
        description="This view aggregates the same mock records used by upload, supervisor scoring, and admin grading so progress is visible in one place."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <SurfaceCard className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {item.value == null ? `Pending / ${item.max}` : `${item.value} / ${item.max}`}
              </p>
            </div>
          ))}
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Final state</p>
            <h3 className="mt-1 text-xl font-semibold">
              {scores?.total == null ? "Incomplete result" : `${scores.total} / 100`}
            </h3>
          </div>
          <p className="text-sm leading-6 text-muted">
            {scores?.status === "complete"
              ? "All grading components are available."
              : "The final result remains incomplete until every grading component has been submitted."}
          </p>
        </SurfaceCard>
      </div>
    </section>
  );
}
