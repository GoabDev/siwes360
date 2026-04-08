import { AdminDashboardView } from "@/features/admin/components/admin-dashboard";

export default function SuperAdminDashboardPage() {
  return (
    <AdminDashboardView
      scope="global"
      eyebrow="Super admin"
      title="Oversee SIWES operations across every department"
      description="Use this workspace to monitor student progress, review grading readiness, and manage records at platform scope."
    />
  );
}
