import { SetPasswordPageView } from "@/features/auth/components/set-password-page";

type SetPasswordPageProps = {
  searchParams?: Promise<{
    userId?: string;
    token?: string;
  }>;
};

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const params = await searchParams;

  return (
    <SetPasswordPageView
      userId={params?.userId?.trim()}
      token={params?.token?.trim()}
    />
  );
}
