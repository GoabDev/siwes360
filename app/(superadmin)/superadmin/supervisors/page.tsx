import { AdminSupervisorsPageView } from "@/features/admin/components/admin-supervisors-page";

export default function SuperAdminSupervisorsPage() {
  return (
    <AdminSupervisorsPageView
      scope="global"
      eyebrow="All supervisors"
      title="Manage supervisor access across departments"
      description="Review active supervisor accounts at platform scope, invite new supervisors, and remove access when needed."
      sectionLabel="Platform supervisors"
      sectionTitle="Supervisor directory and invitations"
      sectionDescription="Search supervisors by department or email and keep supervisor access aligned across the platform."
    />
  );
}
