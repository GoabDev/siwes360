"use client";

import { SurfaceCard } from "@/components/ui/surface-card";
import { useSupervisorSubmissionsQuery } from "@/features/supervisor/queries/supervisor-student-queries";

export function SupervisorSubmissionsList() {
  const submissionsQuery = useSupervisorSubmissionsQuery();

  if (submissionsQuery.isLoading) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Submitted scores</p>
        <h3 className="text-xl font-semibold">Loading your score history</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather the supervision scores you have already submitted.
        </p>
      </SurfaceCard>
    );
  }

  if (!submissionsQuery.data?.length) {
    return (
      <SurfaceCard>
        <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
          You have not submitted any supervision scores yet.
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="overflow-hidden p-0">
      <div className="hidden grid-cols-[1.2fr_1fr_0.6fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
        <span>Student</span>
        <span>Matric number</span>
        <span>Score</span>
        <span>Submitted</span>
      </div>
      <div className="divide-y divide-border/60">
        {submissionsQuery.data.map((submission) => (
          <div
            key={submission.matricNumber}
            className="px-5 py-4 text-sm"
          >
            <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 lg:hidden">
              <div>
                <p className="font-medium">{submission.fullName}</p>
                <p className="mt-1 text-xs text-muted">{submission.matricNumber}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Score</p>
                  <p className="mt-1">{submission.score} / 10</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Submitted</p>
                  <p className="mt-1 text-muted">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1.2fr_1fr_0.6fr_0.9fr] lg:gap-4">
              <span className="font-medium">{submission.fullName}</span>
              <span className="text-muted">{submission.matricNumber}</span>
              <span>{submission.score} / 10</span>
              <span className="text-muted">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
