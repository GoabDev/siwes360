import { SupervisorScoreEntryPageView } from "@/features/supervisor/components/supervisor-score-entry-page";

type SupervisorScoreEntryPageProps = {
  params: Promise<{
    matricNo: string;
  }>;
};

export default async function SupervisorScoreEntryPage({
  params,
}: SupervisorScoreEntryPageProps) {
  const { matricNo } = await params;

  return <SupervisorScoreEntryPageView matricNumber={matricNo} />;
}
