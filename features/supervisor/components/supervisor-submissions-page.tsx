import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SupervisorSubmissionsList } from "@/features/supervisor/components/supervisor-submissions-list";

export function SupervisorSubmissionsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Submissions"
        title="Review supervision scores you have already submitted"
        description="Look back at the supervision scores you have already submitted."
      />
      <SupervisorSubmissionsList />
    </section>
  );
}
