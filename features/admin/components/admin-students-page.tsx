import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminStudentsTable } from "@/features/admin/components/admin-students-table";

export function AdminStudentsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Department students"
        title="Review students in your department"
        description="Open any student to view their details, check progress, and complete grading."
      />
      <AdminStudentsTable />
    </section>
  );
}
