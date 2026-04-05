import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SupervisorStudentsTable } from "@/features/supervisor/components/supervisor-students-table";

export function SupervisorSearchPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Students"
        title="Review and search assigned students before scoring"
        description="Browse your students, search by name or matric number, and continue to scoring."
      />
      <SupervisorStudentsTable />
    </section>
  );
}
