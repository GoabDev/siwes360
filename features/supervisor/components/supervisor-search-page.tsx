import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SupervisorStudentsTable } from "@/features/supervisor/components/supervisor-students-table";

export function SupervisorSearchPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Students"
        title="Review and search assigned students before scoring"
        description="Browse students in your supervision scope, search by name or matric number, and continue directly into score entry."
      />
      <SupervisorStudentsTable />
    </section>
  );
}
