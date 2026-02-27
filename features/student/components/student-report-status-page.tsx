"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StudentReportReviewPanels } from "@/features/student/components/student-report-review-panels";
import { StudentReportStatusCard } from "@/features/student/components/student-report-status-card";
import { StudentReportTimeline } from "@/features/student/components/student-report-timeline";
import { useStudentReportQuery } from "@/features/student/queries/student-report-queries";

export function StudentReportStatusPageView() {
  const reportQuery = useStudentReportQuery();
  const report = reportQuery.data ?? null;

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Report status"
        title="Track review progress from upload through grading"
        description="This page reflects the current report workflow and will later bind to backend formatting, plagiarism, AI, and report-score output."
      />

      <SurfaceCard className="space-y-5">
        <StudentReportStatusCard report={report} />
        <StudentReportTimeline status={report?.status ?? "not_uploaded"} />
      </SurfaceCard>

      <StudentReportReviewPanels report={report} />
    </section>
  );
}
