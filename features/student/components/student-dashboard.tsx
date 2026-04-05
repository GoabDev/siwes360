"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useStudentProfileQuery } from "@/features/student/queries/student-profile-queries";
import {
  useStoredStudentSubmissionIdQuery,
  useStudentDocumentStatusQuery,
} from "@/features/student/queries/student-report-queries";
import { useStudentScoresQuery } from "@/features/student/queries/student-scores-queries";
import { getApiErrorMessage } from "@/lib/api/error";

export function StudentDashboardView() {
  const profileQuery = useStudentProfileQuery();
  const submissionIdQuery = useStoredStudentSubmissionIdQuery();
  const reportQuery = useStudentDocumentStatusQuery(submissionIdQuery.data);
  const scoresQuery = useStudentScoresQuery();

  const profile = profileQuery.data;
  const report = reportQuery.data;
  const scores = scoresQuery.data;
  const dataError =
    profileQuery.error ?? submissionIdQuery.error ?? reportQuery.error ?? scoresQuery.error;
  const isLoading =
    profileQuery.isLoading || submissionIdQuery.isLoading || reportQuery.isLoading || scoresQuery.isLoading;

  const studentStats = [
    {
      label: "Profile completion",
      value: isLoading && !profile ? "Loading..." : profile ? "100%" : "Pending",
      detail: profile
        ? "Profile data is available for the rest of the SIWES workflow."
        : "Complete your profile to unlock stronger student context across the platform.",
    },
    {
      label: "Report status",
      value: isLoading && !report ? "Loading..." : report ? report.currentStatus : "Awaiting upload",
      detail: report
        ? `Current file: ${report.fileName}`
        : "No SIWES report has been submitted yet.",
    },
    {
      label: "Score visibility",
      value:
        isLoading && !scores
          ? "Loading..."
          : scores?.total == null
            ? "Incomplete"
            : `${scores.total} / 100`,
      detail:
        scores?.status === "complete"
          ? "All grading components are available."
          : "Final grading remains locked until every score component is submitted.",
    },
  ];

  const progressRows = [
    {
      label: "Profile setup",
      done: Boolean(profile),
    },
    {
      label: "Report uploaded",
      done: Boolean(report),
    },
    {
      label: "Supervisor score submitted",
      done: scores?.supervisor !== null,
    },
    {
      label: "Admin grading submitted",
      done: scores?.logbook !== null && scores?.presentation !== null,
    },
    {
      label: "Final result complete",
      done: scores?.status === "complete",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Student"
        title="Track your SIWES progress from onboarding to final grading"
        description="This dashboard will evolve into the main student workspace for report submission, status tracking, and score review."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {studentStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      {isLoading && !dataError ? (
        <SurfaceCard>
          <p className="text-sm leading-6 text-muted">
            Refreshing your profile, report status, and grading progress from the backend.
          </p>
        </SurfaceCard>
      ) : null}
      {dataError ? (
        <SurfaceCard className="border-rose-200 bg-rose-50/80 text-rose-700">
          <p className="text-sm leading-6">
            {getApiErrorMessage(
              dataError,
              "Some student dashboard data could not be loaded from the backend.",
            )}
          </p>
        </SurfaceCard>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Workflow</p>
            <h3 className="mt-1 text-xl font-semibold">Current student progress</h3>
          </div>
          <div className="space-y-3">
            {progressRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3"
              >
                <p className="text-sm font-medium">{row.label}</p>
                <StatusBadge
                  label={row.done ? "Done" : "Pending"}
                  variant={row.done ? "success" : "pending"}
                />
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Recent state</p>
            <h3 className="mt-1 text-xl font-semibold">What the system currently knows about you</h3>
          </div>
          <div className="grid gap-3 text-sm text-muted">
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Department</p>
              <p className="mt-1 text-foreground">
                {profileQuery.isLoading && !profile ? "Loading..." : profile?.department ?? "Not available yet"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Matric number</p>
              <p className="mt-1 text-foreground">
                {profileQuery.isLoading && !profile ? "Loading..." : profile?.matricNumber ?? "Not available yet"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Latest report stage</p>
              <p className="mt-1 text-foreground">
                {reportQuery.isLoading && !report ? "Loading..." : report?.currentStatus ?? "Not uploaded"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Final grade</p>
              <p className="mt-1 text-foreground">
                {scoresQuery.isLoading && !scores
                  ? "Loading..."
                  : scores?.grade ?? (scores?.isFinalized ? "Pending" : "Not finalized")}
              </p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
