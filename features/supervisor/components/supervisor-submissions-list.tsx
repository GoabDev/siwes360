"use client";

import { SurfaceCard } from "@/components/ui/surface-card";
import { useSupervisorSubmissionsQuery } from "@/features/supervisor/queries/supervisor-student-queries";

export function SupervisorSubmissionsList() {
  const submissionsQuery = useSupervisorSubmissionsQuery();

  if (submissionsQuery.isLoading) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">Loading submitted supervision scores...</p>
      </SurfaceCard>
    );
  }

  if (!submissionsQuery.data?.length) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">
          No supervision scores have been submitted yet. Submitted records will appear here.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="overflow-hidden p-0">
      <div className="grid grid-cols-[1.2fr_1fr_0.6fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted">
        <span>Student</span>
        <span>Matric number</span>
        <span>Score</span>
        <span>Submitted</span>
      </div>
      <div className="divide-y divide-border/60">
        {submissionsQuery.data.map((submission) => (
          <div
            key={submission.matricNumber}
            className="grid grid-cols-[1.2fr_1fr_0.6fr_0.9fr] gap-4 px-5 py-4 text-sm"
          >
            <span className="font-medium">{submission.fullName}</span>
            <span className="text-muted">{submission.matricNumber}</span>
            <span>{submission.score} / 10</span>
            <span className="text-muted">
              {new Date(submission.submittedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
