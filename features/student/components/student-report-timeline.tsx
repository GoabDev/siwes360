import type { StudentReportStatus } from "@/features/student/types/student-report";

const stageOrder: StudentReportStatus[] = [
  "uploaded",
  "format_check",
  "ai_review",
  "graded",
];

const stageCopy: Record<
  StudentReportStatus,
  { label: string; detail: string }
> = {
  not_uploaded: {
    label: "Not uploaded",
    detail: "Submission has not started.",
  },
  uploaded: {
    label: "Uploaded",
    detail: "Report file received and queued.",
  },
  format_check: {
    label: "Formatting check",
    detail: "Margins, structure, and document rules are being reviewed.",
  },
  ai_review: {
    label: "AI and plagiarism review",
    detail: "Similarity and AI-use checks are in progress.",
  },
  graded: {
    label: "Graded",
    detail: "Report review completed and score is ready.",
  },
};

type StudentReportTimelineProps = {
  status: StudentReportStatus;
};

export function StudentReportTimeline({ status }: StudentReportTimelineProps) {
  const currentIndex = stageOrder.indexOf(status);

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {stageOrder.map((stage, index) => {
        const isComplete = index < currentIndex || status === "graded";
        const isCurrent = stage === status;

        return (
          <article
            key={stage}
            className={`rounded-[1.35rem] border p-4 transition ${
              isCurrent
                ? "border-brand/40 bg-brand/8"
                : isComplete
                  ? "border-border/70 bg-background/60"
                  : "border-border/60 bg-background/35"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  isCurrent
                    ? "bg-brand text-white"
                    : isComplete
                      ? "bg-accent/25 text-brand-strong"
                      : "bg-surface-strong text-muted"
                }`}
              >
                {index + 1}
              </span>
              <p className="text-sm font-medium">{stageCopy[stage].label}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{stageCopy[stage].detail}</p>
          </article>
        );
      })}
    </div>
  );
}
