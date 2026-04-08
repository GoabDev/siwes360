import { AdminScoreEntryPageView } from "@/features/admin/components/admin-score-entry-page";

type SuperAdminScoreEntryPageProps = {
  params: Promise<{
    matricNo: string;
  }>;
};

export default async function SuperAdminScoreEntryPage({
  params,
}: SuperAdminScoreEntryPageProps) {
  const { matricNo } = await params;

  return <AdminScoreEntryPageView matricNumber={matricNo} scope="global" />;
}
