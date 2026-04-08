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
          description="Your latest report feedback is being prepared."
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
          description="Upload a SIWES report to start seeing checks and feedback here."
        />
      </SurfaceCard>
    );
  }

  const passedRules = report.results.filter((item) => item.severity === "Pass");
  const warningRules = report.results.filter((item) => item.severity === "Warning");
  const failedRules = report.results.filter((item) => item.severity === "Fail");

  function getSeverityStyles(severity: "Pass" | "Warning" | "Fail") {
    if (severity === "Pass") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (severity === "Warning") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <SurfaceCard>
      <SectionHeading
        eyebrow="Validation"
        title="Checks and rule feedback"
        description="See your validation status and review each formatting check in one place."
      />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Validation status", value: report.status },
          { label: "Review outcome", value: report.score == null ? "Awaiting review" : "Reviewed" },
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
      {report.results.length ? (
        <div className="mt-4 rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Rule feedback</p>
          <div className="mt-3 space-y-3">
            {report.results.map((result) => (
              <div key={result.ruleId} className="rounded-[1rem] border border-border/60 bg-background px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="mt-1 text-xs text-muted">Rule: {result.ruleId}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getSeverityStyles(result.severity)}`}
                  >
                    {result.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{result.details}</p>
                <p className="mt-2 text-xs text-muted">Weight: {result.weight}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
