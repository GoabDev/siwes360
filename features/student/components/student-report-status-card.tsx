import type {
  StudentDocumentStatus,
  StudentValidationReport,
} from "@/features/student/types/student-report";

type StudentReportStatusCardProps = {
  status: StudentDocumentStatus | null;
  report: StudentValidationReport | null;
};

function getUploadedAt(status: StudentDocumentStatus | null) {
  return status?.timeline.find((item) => item.status === "Uploaded")?.occurredAt ?? null;
}

export function StudentReportStatusCard({ status, report }: StudentReportStatusCardProps) {
  if (!status) {
    return (
      <div className="rounded-[1.35rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
        No report has been uploaded yet. Once a file is submitted, its workflow status and submission details will appear here.
      </div>
    );
  }

  const uploadedAt = getUploadedAt(status);

  return (
    <div className="rounded-[1.35rem] border border-border/70 bg-background/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Current submission</p>
          <h3 className="mt-1 text-xl font-semibold">{status.fileName}</h3>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
          {status.currentStatus}
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2 xl:grid-cols-4">
        <p>File: <span className="text-foreground">{status.fileName}</span></p>
        <p>Submission ID: <span className="text-foreground">{status.submissionId}</span></p>
        <p>Uploaded: <span className="text-foreground">{uploadedAt ? new Date(uploadedAt).toLocaleString() : "Pending"}</span></p>
        <p>Score: <span className="text-foreground">{report?.score == null ? "Pending" : `${report.score} / 100`}</span></p>
      </div>
      {report?.validatedAt ? (
        <p className="mt-4 text-sm leading-6 text-muted">
          Validation completed on <span className="text-foreground">{new Date(report.validatedAt).toLocaleString()}</span>.
        </p>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">
          The backend will update this record as the document moves from queueing into validation.
        </p>
      )}
    </div>
  );
}
