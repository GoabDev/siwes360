import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SupervisorSearchForm } from "@/features/supervisor/components/supervisor-search-form";

export function SupervisorSearchPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Student lookup"
        title="Find the right student before supervision scoring"
        description="Search by matric number, verify the student context, and continue into score entry from a reliable record."
      />
      <SupervisorSearchForm />
    </section>
  );
}
