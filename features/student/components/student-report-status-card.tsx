import type { StudentReportRecord } from "@/features/student/types/student-report";

const statusMap = {
  not_uploaded: "Not uploaded",
  uploaded: "Uploaded",
  format_check: "Formatting check",
  ai_review: "AI and plagiarism review",
  graded: "Graded",
};

type StudentReportStatusCardProps = {
  report: StudentReportRecord | null;
};

export function StudentReportStatusCard({ report }: StudentReportStatusCardProps) {
  if (!report) {
    return (
      <div className="rounded-[1.35rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
        No report has been uploaded yet. Once a file is submitted, its workflow status and submission details will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-[1.35rem] border border-border/70 bg-background/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Current submission</p>
          <h3 className="mt-1 text-xl font-semibold">{report.title}</h3>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
          {statusMap[report.status]}
        </span>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-3">
        <p>File: <span className="text-foreground">{report.fileName}</span></p>
        <p>Size: <span className="text-foreground">{Math.ceil(report.fileSize / 1024)} KB</span></p>
        <p>Submitted: <span className="text-foreground">{new Date(report.submittedAt).toLocaleString()}</span></p>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{report.summary}</p>
    </div>
  );
}
