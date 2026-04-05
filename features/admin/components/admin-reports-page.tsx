import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminReportsOverview } from "@/features/admin/components/admin-reports-overview";

export function AdminReportsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Reports overview"
        title="Review grading progress across your department"
        description="See which students are ready for final grading and which ones still need attention."
      />
      <AdminReportsOverview />
    </section>
  );
}
