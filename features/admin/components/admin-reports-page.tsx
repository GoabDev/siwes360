import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminReportsOverview } from "@/features/admin/components/admin-reports-overview";

export function AdminReportsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Reports overview"
        title="Review report readiness before final grading"
        description="This view helps departmental admins understand which records are ready to move toward completion."
      />
      <AdminReportsOverview />
    </section>
  );
}
