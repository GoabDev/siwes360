"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StudentReportReviewPanels } from "@/features/student/components/student-report-review-panels";
import { StudentReportStatusCard } from "@/features/student/components/student-report-status-card";
import { StudentReportTimeline } from "@/features/student/components/student-report-timeline";
import { StudentWorkflowChecklist } from "@/features/student/components/student-workflow-checklist";
import {
  useStoredStudentSubmissionIdQuery,
  useStudentDocumentStatusQuery,
  useStudentValidationReportQuery,
} from "@/features/student/queries/student-report-queries";
import { useStudentWorkflowQuery } from "@/features/student/queries/student-workflow-queries";
import { getApiErrorMessage } from "@/lib/api/error";

export function StudentReportStatusPageView() {
  const submissionIdQuery = useStoredStudentSubmissionIdQuery();
  const statusQuery = useStudentDocumentStatusQuery(submissionIdQuery.data);
  const validationReportQuery = useStudentValidationReportQuery(submissionIdQuery.data);
  const workflowQuery = useStudentWorkflowQuery();

  const status = statusQuery.data ?? null;
  const report = validationReportQuery.data ?? null;
  const statusError =
    submissionIdQuery.error ?? statusQuery.error ?? validationReportQuery.error ?? workflowQuery.error;
  const isLoading =
    submissionIdQuery.isLoading ||
    statusQuery.isLoading ||
    validationReportQuery.isLoading ||
    workflowQuery.isLoading;

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Report status"
        title="Track review progress from upload through grading"
        description="See where your report is in the review process and check the latest feedback."
      />

      <SurfaceCard className="space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Submission tracker</p>
          <h3 className="mt-1 text-xl font-semibold">Latest upload and review status</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            This section updates as your document is uploaded, checked, and scored.
          </p>
        </div>
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

      {workflowQuery.data?.steps?.length ? (
        <StudentWorkflowChecklist
          steps={workflowQuery.data.steps}
          title="Workflow progress beyond document review"
          description="This checklist tracks your progress after upload, including supervisor scoring and final admin grading."
        />
      ) : null}

      <StudentReportReviewPanels report={report} isLoading={isLoading && !statusError && !report} />
    </section>
  );
}
