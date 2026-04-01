import type { Metadata } from "next";
import { ResendVerificationPageView } from "@/features/auth/components/resend-verification-page";

export const metadata: Metadata = {
  title: "Verify Email",
};

type VerifyEmailEntryPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailEntryPage({
  searchParams,
}: VerifyEmailEntryPageProps) {
  const params = await searchParams;

  return <ResendVerificationPageView email={params?.email?.trim()} />;
}
