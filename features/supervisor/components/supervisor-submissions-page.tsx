import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SupervisorSubmissionsList } from "@/features/supervisor/components/supervisor-submissions-list";

export function SupervisorSubmissionsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Submissions"
        title="Review supervision scores you have already submitted"
        description="This history will later align with backend permissions for edits, audit trails, and supervisor activity."
      />
      <SupervisorSubmissionsList />
    </section>
  );
}
