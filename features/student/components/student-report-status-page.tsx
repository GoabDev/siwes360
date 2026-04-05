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
import { getApiErrorMessage } from "@/lib/api/error";

export function StudentReportStatusPageView() {
  const submissionIdQuery = useStoredStudentSubmissionIdQuery();
  const statusQuery = useStudentDocumentStatusQuery(submissionIdQuery.data);
  const validationReportQuery = useStudentValidationReportQuery(submissionIdQuery.data);

  const status = statusQuery.data ?? null;
  const report = validationReportQuery.data ?? null;
  const statusError = submissionIdQuery.error ?? statusQuery.error ?? validationReportQuery.error;
  const isLoading =
    submissionIdQuery.isLoading ||
    statusQuery.isLoading ||
    validationReportQuery.isLoading;

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Report status"
        title="Track review progress from upload through grading"
        description="This page reflects the live backend document queue, validation timeline, and rule-based report output."
      />

      <SurfaceCard className="space-y-5">
        {statusError ? (
          <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {getApiErrorMessage(statusError, "Unable to load your report status.")}
          </div>
        ) : null}
        <StudentReportStatusCard status={status} report={report} isLoading={isLoading && !statusError} />
        <StudentReportTimeline
          timeline={status?.timeline ?? []}
          isLoading={isLoading && !statusError && !status}
        />
      </SurfaceCard>

      <StudentReportReviewPanels report={report} isLoading={isLoading && !statusError && !report} />
    </section>
  );
}
