import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { StudentValidationReport } from "@/features/student/types/student-report";

type StudentReportReviewPanelsProps = {
  report: StudentValidationReport | null;
  isLoading?: boolean;
};

export function StudentReportReviewPanels({
  report,
  isLoading = false,
}: StudentReportReviewPanelsProps) {
  if (isLoading) {
    return (
      <SurfaceCard>
        <SectionHeading
          eyebrow="Review results"
          title="Validation summary is loading"
          description="The backend validation report is being fetched for your most recent submission."
        />
      </SurfaceCard>
    );
  }

  if (!report) {
    return (
      <SurfaceCard>
        <SectionHeading
          eyebrow="Review results"
          title="No report under review"
          description="Upload a SIWES report first to unlock the backend validation summary and rule results."
        />
      </SurfaceCard>
    );
  }

  const passedRules = report.results.filter((item) => item.severity === "Pass");
  const warningRules = report.results.filter((item) => item.severity === "Warning");
  const failedRules = report.results.filter((item) => item.severity === "Fail");

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <SurfaceCard>
        <SectionHeading
          eyebrow="Formatting"
          title="Document compliance checks"
          description="These panels map directly to the backend validation report returned for the uploaded document."
        />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Passed rules", value: `${passedRules.length}` },
            { label: "Warnings", value: `${warningRules.length}` },
            { label: "Failed rules", value: `${failedRules.length}` },
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
          eyebrow="Validation"
          title="Score and rule details"
          description="The current backend exposes validation score and rule-level formatting or structure results."
        />
        <div className="mt-4 space-y-3">
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Validation status</p>
            <p className="mt-2 text-lg font-semibold">{report.status}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Report score</p>
            <p className="mt-2 text-lg font-semibold">
              {report.score == null ? "Awaiting review" : `${report.score} / 100`}
            </p>
          </div>
          {report.results.length ? (
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Latest rule feedback</p>
              <div className="mt-3 space-y-3">
                {report.results.slice(0, 4).map((result) => (
                  <div key={result.ruleId} className="rounded-[1rem] border border-border/60 bg-background px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{result.title}</p>
                      <span className="text-xs font-medium text-muted">{result.severity}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{result.details}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </SurfaceCard>
    </div>
  );
}
