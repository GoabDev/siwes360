import type { Metadata } from "next";
import { VerifyEmailPageView } from "@/features/auth/components/verify-email-page";

export const metadata: Metadata = {
  title: "Verify Email",
};

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    userId?: string;
    token?: string;
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;

  return (
    <VerifyEmailPageView
      userId={params?.userId?.trim()}
      token={params?.token?.trim()}
      email={params?.email?.trim()}
    />
  );
}
