"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StudentWorkflowChecklist } from "@/features/student/components/student-workflow-checklist";
import { useStudentProfileQuery } from "@/features/student/queries/student-profile-queries";
import {
  useStoredStudentSubmissionIdQuery,
  useStudentDocumentStatusQuery,
} from "@/features/student/queries/student-report-queries";
import { useStudentScoresQuery } from "@/features/student/queries/student-scores-queries";
import { useStudentWorkflowQuery } from "@/features/student/queries/student-workflow-queries";
import { getApiErrorMessage } from "@/lib/api/error";

export function StudentDashboardView() {
  const profileQuery = useStudentProfileQuery();
  const submissionIdQuery = useStoredStudentSubmissionIdQuery();
  const reportQuery = useStudentDocumentStatusQuery(submissionIdQuery.data);
  const scoresQuery = useStudentScoresQuery();
  const workflowQuery = useStudentWorkflowQuery();

  const profile = profileQuery.data;
  const report = reportQuery.data;
  const scores = scoresQuery.data;
  const workflow = workflowQuery.data;
  const dataError =
    profileQuery.error ??
    submissionIdQuery.error ??
    reportQuery.error ??
    scoresQuery.error ??
    workflowQuery.error;
  const isLoading =
    profileQuery.isLoading ||
    submissionIdQuery.isLoading ||
    reportQuery.isLoading ||
    scoresQuery.isLoading ||
    workflowQuery.isLoading;

  const studentStats = [
    {
      label: "Profile completion",
      value:
        isLoading && !workflow
          ? "Loading..."
          : workflow?.steps.find((step) => step.key === "profile-setup")?.isDone
            ? "100%"
            : "Pending",
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
      label: "Result status",
      value:
        isLoading && !scores
          ? "Loading..."
          : scores?.status === "complete"
            ? "Under review"
            : "Pending",
      detail:
        scores?.status === "complete"
          ? "All assessment stages are complete. Final scores remain hidden from students."
          : "Your department is still processing the grading workflow.",
    },
  ];

  const workflowSteps =
    workflow?.steps ??
    [
      {
        key: "profile-setup",
        label: "Profile setup",
        status: Boolean(profile) ? "Done" : "Pending",
        isDone: Boolean(profile),
      },
      {
        key: "report-uploaded",
        label: "Report uploaded",
        status: Boolean(report) ? "Done" : "Pending",
        isDone: Boolean(report),
      },
      {
        key: "supervisor-score-submitted",
        label: "Supervisor score submitted",
        status: scores?.supervisor !== null ? "Done" : "Pending",
        isDone: scores?.supervisor !== null,
      },
      {
        key: "admin-grading-submitted",
        label: "Admin grading submitted",
        status: scores?.logbook !== null && scores?.presentation !== null ? "Done" : "Pending",
        isDone: scores?.logbook !== null && scores?.presentation !== null,
      },
      {
        key: "final-result-complete",
        label: "Final result complete",
        status: scores?.status === "complete" ? "Done" : "Pending",
        isDone: scores?.status === "complete",
      },
    ];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Student"
        title="Track your SIWES progress from onboarding to final grading"
        description="Use this dashboard to follow your report and check your progress through the grading workflow."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {studentStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      {isLoading && !dataError ? (
        <SurfaceCard>
          <p className="text-sm leading-6 text-muted">
            Updating your profile, report status, and workflow progress.
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
        <StudentWorkflowChecklist steps={workflowSteps} />

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Overview</p>
            <h3 className="mt-1 text-xl font-semibold">Your latest details</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep these details in view while your report moves through review and grading.
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
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Assessment outcome</p>
              <p className="mt-1 text-foreground">
                {scoresQuery.isLoading && !scores
                  ? "Loading..."
                  : scores?.status === "complete"
                    ? "Completed"
                    : "In progress"}
              </p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
