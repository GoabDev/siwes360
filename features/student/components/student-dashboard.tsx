"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useStudentProfileQuery } from "@/features/student/queries/student-profile-queries";
import { useStudentReportQuery } from "@/features/student/queries/student-report-queries";
import { useStudentScoresQuery } from "@/features/student/queries/student-scores-queries";

export function StudentDashboardView() {
  const profileQuery = useStudentProfileQuery();
  const reportQuery = useStudentReportQuery();
  const scoresQuery = useStudentScoresQuery();

  const profile = profileQuery.data;
  const report = reportQuery.data;
  const scores = scoresQuery.data;

  const studentStats = [
    {
      label: "Profile completion",
      value: profile ? "100%" : "Pending",
      detail: profile
        ? "Profile data is available for the rest of the SIWES workflow."
        : "Complete your profile to unlock stronger student context across the platform.",
    },
    {
      label: "Report status",
      value: report ? report.status.replace("_", " ") : "Awaiting upload",
      detail: report
        ? `Current file: ${report.fileName}`
        : "No SIWES report has been submitted yet.",
    },
    {
      label: "Score visibility",
      value: scores?.total == null ? "Incomplete" : `${scores.total} / 100`,
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
              <p className="mt-1 text-foreground">{profile?.department ?? "Not available yet"}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Placement</p>
              <p className="mt-1 text-foreground">{profile?.placementCompany ?? "No placement profile saved yet"}</p>
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Latest report stage</p>
              <p className="mt-1 text-foreground">{report?.status ?? "not_uploaded"}</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
