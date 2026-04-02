"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StudentReportReviewPanels } from "@/features/student/components/student-report-review-panels";
import { StudentReportStatusCard } from "@/features/student/components/student-report-status-card";
import { StudentReportTimeline } from "@/features/student/components/student-report-timeline";
import {
  useStoredStudentSubmissionIdQuery,
  useStudentDocumentStatusQuery,
  useStudentValidationReportQuery,
} from "@/features/student/queries/student-report-queries";

export function StudentReportStatusPageView() {
  const submissionIdQuery = useStoredStudentSubmissionIdQuery();
  const statusQuery = useStudentDocumentStatusQuery(submissionIdQuery.data);
  const validationReportQuery = useStudentValidationReportQuery(
    submissionIdQuery.data,
    statusQuery.data?.currentStatus === "Completed" || statusQuery.data?.currentStatus === "Failed",
  );

  const status = statusQuery.data ?? null;
  const report = validationReportQuery.data ?? null;

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Report status"
        title="Track review progress from upload through grading"
        description="This page reflects the live backend document queue, validation timeline, and rule-based report output."
      />

      <SurfaceCard className="space-y-5">
        <StudentReportStatusCard status={status} report={report} />
        <StudentReportTimeline timeline={status?.timeline ?? []} />
      </SurfaceCard>

      <StudentReportReviewPanels report={report} />
    </section>
  );
}
