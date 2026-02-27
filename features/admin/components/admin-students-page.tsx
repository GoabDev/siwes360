import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminStudentsTable } from "@/features/admin/components/admin-students-table";

export function AdminStudentsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Department students"
        title="Track grading coverage across your department"
        description="This table consolidates report, supervisor, and admin grading progress so incomplete records are visible immediately."
      />
      <AdminStudentsTable />
    </section>
  );
}
