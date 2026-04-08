import { AdminStudentsPageView } from "@/features/admin/components/admin-students-page";

export default function SuperAdminStudentsPage() {
  return (
    <AdminStudentsPageView
      basePath="/superadmin"
      scope="global"
      eyebrow="All students"
      title="Review students across every department"
      description="Open any student record, inspect scoring progress, and resolve grading issues without department limits."
    />
  );
}
