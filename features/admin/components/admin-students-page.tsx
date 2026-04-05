import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminStudentsTable } from "@/features/admin/components/admin-students-table";

export function AdminStudentsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Department students"
        title="Review students in your department"
        description="Open any student record to inspect their profile, then fetch grading status and score details on a dedicated page."
      />
      <AdminStudentsTable />
    </section>
  );
}
