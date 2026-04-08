import { AdminReportsPageView } from "@/features/admin/components/admin-reports-page";

export default function SuperAdminReportsPage() {
  return (
    <AdminReportsPageView
      basePath="/superadmin"
      scope="global"
      eyebrow="Platform reports"
      title="Review grading progress across all departments"
      description="Filter by department, export results, and monitor which records are ready for platform-wide closeout."
    />
  );
}
