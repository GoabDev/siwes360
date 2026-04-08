"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useStudentScoresQuery } from "@/features/student/queries/student-scores-queries";
import { getApiErrorMessage } from "@/lib/api/error";

export function StudentScoresBreakdown() {
  const scoresQuery = useStudentScoresQuery();
  const scores = scoresQuery.data;

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Assessment progress"
        title="Track grading progress without exposing final scores"
        description="This page shows whether each stage of your assessment workflow has been completed."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <SurfaceCard className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Assessment stages</p>
            <h3 className="mt-1 text-xl font-semibold">How your workflow is progressing</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Each section below updates as your report moves through validation, supervision, and admin grading.
            </p>
          </div>
          {scoresQuery.isLoading ? (
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4 text-sm text-muted md:col-span-2">
              Loading your current assessment progress...
            </div>
          ) : null}
          {scoresQuery.error ? (
            <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 md:col-span-2">
              {getApiErrorMessage(scoresQuery.error, "Unable to load your assessment progress.")}
            </div>
          ) : null}
          {[
            { label: "Validation review", isDone: scores?.validation !== null },
            { label: "Report review", isDone: scores?.report !== null },
            { label: "Supervisor assessment", isDone: scores?.supervisor !== null },
            { label: "Logbook grading", isDone: scores?.logbook !== null },
            { label: "Presentation grading", isDone: scores?.presentation !== null },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {scoresQuery.isLoading ? "Loading" : item.isDone ? "Completed" : "Pending"}
              </p>
            </div>
          ))}
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Workflow state</p>
            <h3 className="mt-1 text-xl font-semibold">
              {scoresQuery.isLoading
                ? "Loading progress"
                : scores?.status === "complete"
                  ? "Assessment complete"
                  : "Assessment in progress"}
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Student visibility</p>
              <p className="mt-2 text-lg font-semibold">
                {scoresQuery.isLoading ? "Loading" : "Final scores hidden"}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Assessment state</p>
              <p className="mt-2 text-lg font-semibold">
                {scoresQuery.isLoading ? "Loading" : scores?.isFinalized ? "Finalized" : "Open"}
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted">
            {scores?.status === "complete"
              ? "All grading components have been completed, but final scores are not shown on the student portal."
              : "Your workflow remains in progress until all grading stages are done."}
          </p>
        </SurfaceCard>
      </div>
    </section>
  );
}
