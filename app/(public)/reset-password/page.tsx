import { ResetPasswordPageView } from "@/features/auth/components/reset-password-page";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    userId?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <ResetPasswordPageView
      userId={params?.userId?.trim()}
      token={params?.token?.trim()}
    />
  );
}
