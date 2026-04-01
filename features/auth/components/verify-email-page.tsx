import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

type VerifyEmailPageViewProps = {
  userId?: string;
  token?: string;
  email?: string;
};

export function VerifyEmailPageView({
  userId,
  token,
  email,
}: VerifyEmailPageViewProps) {
  return (
    <AuthPageShell
      eyebrow="Email verification"
      title="Verify your account email"
      description="Use the verification link sent to your inbox. If the original email expired or got lost, request another one here."
      footerText="Already verified?"
      footerAction={{ href: "/auth/login", label: "Go to login" }}
    >
      <VerifyEmailForm userId={userId} token={token} email={email} />
    </AuthPageShell>
  );
}
