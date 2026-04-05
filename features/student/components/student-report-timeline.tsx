import type { StudentDocumentTimelineEvent } from "@/features/student/types/student-report";

type StudentReportTimelineProps = {
  timeline: StudentDocumentTimelineEvent[];
  isLoading?: boolean;
};

export function StudentReportTimeline({
  timeline,
  isLoading = false,
}: StudentReportTimelineProps) {
  if (isLoading) {
    return (
      <div className="rounded-[1.35rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
        Loading report timeline events...
      </div>
    );
  }

  if (!timeline.length) {
    return (
      <div className="rounded-[1.35rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
        Timeline events will appear here after a report has been uploaded.
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {timeline.map((event, index) => {
        const isCurrent = index === timeline.length - 1;
        return (
          <article
            key={`${event.status}-${event.occurredAt}`}
            className={`rounded-[1.35rem] border p-4 transition ${
              isCurrent
                ? "border-brand/40 bg-brand/8"
                : "border-border/70 bg-background/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  isCurrent
                    ? "bg-brand text-white"
                    : "bg-accent/25 text-brand-strong"
                }`}
              >
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium">{event.status}</p>
                <p className="text-xs text-muted">{new Date(event.occurredAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{event.description}</p>
          </article>
        );
      })}
    </div>
  );
}
