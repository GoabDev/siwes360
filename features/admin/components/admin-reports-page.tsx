import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminReportsOverview } from "@/features/admin/components/admin-reports-overview";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminReportsPageViewProps = {
  basePath?: string;
  scope?: AdminWorkspaceScope;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AdminReportsPageView({
  basePath = "/admin",
  scope = "department",
  eyebrow = "Reports overview",
  title = "Review grading progress across your department",
  description = "See which students are ready for final grading and which ones still need attention.",
}: AdminReportsPageViewProps) {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <AdminReportsOverview basePath={basePath} scope={scope} />
    </section>
  );
}
