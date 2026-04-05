import { AdminStudentDetailPageView } from "@/features/admin/components/admin-student-detail-page";

type AdminStudentDetailPageProps = {
  params: Promise<{
    matricNo: string;
  }>;
};

export default async function AdminStudentDetailPage({
  params,
}: AdminStudentDetailPageProps) {
  const { matricNo } = await params;

  return <AdminStudentDetailPageView matricNumber={matricNo} />;
}
