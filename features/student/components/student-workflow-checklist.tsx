import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { StudentWorkflowStep } from "@/features/student/types/student-workflow";

type StudentWorkflowChecklistProps = {
  steps: StudentWorkflowStep[];
  title?: string;
  description?: string;
};

export function StudentWorkflowChecklist({
  steps,
  title = "Your SIWES checklist",
  description = "Follow each step from profile setup to final grading.",
}: StudentWorkflowChecklistProps) {
  return (
    <SurfaceCard className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Workflow</p>
        <h3 className="mt-1 text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.key}
            className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{step.label}</p>
              <p className="mt-1 text-xs text-muted">{step.status}</p>
            </div>
            <StatusBadge
              label={step.isDone ? "Done" : "Pending"}
              variant={step.isDone ? "success" : "pending"}
            />
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
