import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { StudentReportRecord } from "@/features/student/types/student-report";

type StudentReportReviewPanelsProps = {
  report: StudentReportRecord | null;
};

export function StudentReportReviewPanels({ report }: StudentReportReviewPanelsProps) {
  if (!report) {
    return (
      <SurfaceCard>
        <SectionHeading
          eyebrow="Review results"
          title="No report under review"
          description="Upload a SIWES report first to unlock the formatting, plagiarism, and grading panels."
        />
      </SurfaceCard>
    );
  }

  const reviewState =
    report.status === "uploaded"
      ? {
          format: "Queued",
          plagiarism: "Pending",
          ai: "Pending",
          score: "Awaiting review",
        }
      : report.status === "format_check"
        ? {
            format: "In progress",
            plagiarism: "Pending",
            ai: "Pending",
            score: "Awaiting review",
          }
        : report.status === "ai_review"
          ? {
              format: "Passed",
              plagiarism: "In progress",
              ai: "In progress",
              score: "Awaiting review",
            }
          : {
              format: "Passed",
              plagiarism: "12% similarity",
              ai: "No AI misuse flagged",
              score: "24 / 30",
            };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <SurfaceCard>
        <SectionHeading
          eyebrow="Formatting"
          title="Document compliance checks"
          description="These review blocks are wired to current report state and will later map directly to backend validation output."
        />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Margins", value: reviewState.format === "Passed" ? "Pass" : reviewState.format },
            { label: "Typography", value: reviewState.format === "Passed" ? "Pass" : "Pending" },
            { label: "Structure", value: reviewState.format === "Passed" ? "Pass" : "Pending" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <SectionHeading
          eyebrow="Integrity"
          title="Plagiarism and AI review"
          description="This summary will align with the backend plagiarism and AI-detection service when integrated."
        />
        <div className="mt-4 space-y-3">
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Similarity check</p>
            <p className="mt-2 text-lg font-semibold">{reviewState.plagiarism}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">AI review</p>
            <p className="mt-2 text-lg font-semibold">{reviewState.ai}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Report score</p>
            <p className="mt-2 text-lg font-semibold">{reviewState.score}</p>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
