import { DashboardHero } from "@/components/ui/dashboard-hero";
import { AdminStudentsTable } from "@/features/admin/components/admin-students-table";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminStudentsPageViewProps = {
  basePath?: string;
  scope?: AdminWorkspaceScope;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AdminStudentsPageView({
  basePath = "/admin",
  scope = "department",
  eyebrow = "Department students",
  title = "Review students in your department",
  description = "Open any student to view their details, check progress, and complete grading.",
}: AdminStudentsPageViewProps) {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <AdminStudentsTable basePath={basePath} scope={scope} />
    </section>
  );
}
