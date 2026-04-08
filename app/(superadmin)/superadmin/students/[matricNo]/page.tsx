import { AdminStudentDetailPageView } from "@/features/admin/components/admin-student-detail-page";

type SuperAdminStudentDetailPageProps = {
  params: Promise<{
    matricNo: string;
  }>;
};

export default async function SuperAdminStudentDetailPage({
  params,
}: SuperAdminStudentDetailPageProps) {
  const { matricNo } = await params;

  return (
    <AdminStudentDetailPageView
      matricNumber={matricNo}
      basePath="/superadmin"
      scope="global"
    />
  );
}
