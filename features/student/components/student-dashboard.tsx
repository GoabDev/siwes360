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
        ? "Your details are ready for report review and grading."
        : "Complete your profile so your department can review your work properly.",
    },
    {
      label: "Report status",
      value: isLoading && !report ? "Loading..." : report ? report.currentStatus : "Awaiting upload",
      detail: report
        ? `Current file: ${report.fileName}`
        : "Upload your SIWES report to begin review.",
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
          ? "All parts of your result are now available."
          : "Your final result will appear after every score has been submitted.",
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
        description="Use this dashboard to follow your report, check your progress, and see when scores become available."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {studentStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      {isLoading && !dataError ? (
        <SurfaceCard>
          <p className="text-sm leading-6 text-muted">
            Updating your profile, report status, and scores.
          </p>
        </SurfaceCard>
      ) : null}
      {dataError ? (
        <SurfaceCard className="border-rose-200 bg-rose-50/80 text-rose-700">
          <p className="text-sm leading-6">
            {getApiErrorMessage(
              dataError,
              "Some information could not be loaded right now.",
            )}
          </p>
        </SurfaceCard>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Progress</p>
            <h3 className="mt-1 text-xl font-semibold">Your SIWES checklist</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Follow each step from profile setup to final grading.
            </p>
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
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Overview</p>
            <h3 className="mt-1 text-xl font-semibold">Your latest details</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep these details in view while your report and scores are being updated.
            </p>
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
