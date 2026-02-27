import { AdminScoreEntryPageView } from "@/features/admin/components/admin-score-entry-page";

type AdminScoreEntryPageProps = {
  params: Promise<{
    matricNo: string;
  }>;
};

export default async function AdminScoreEntryPage({ params }: AdminScoreEntryPageProps) {
  const { matricNo } = await params;

  return <AdminScoreEntryPageView matricNumber={matricNo} />;
}
