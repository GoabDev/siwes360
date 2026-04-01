import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ResendVerificationForm } from "@/features/auth/components/resend-verification-form";

type ResendVerificationPageViewProps = {
  email?: string;
};

export function ResendVerificationPageView({
  email,
}: ResendVerificationPageViewProps) {
  return (
    <AuthPageShell
      eyebrow="Email verification"
      title="Resend your verification email"
      description="If login is blocked because your account is not verified yet, request another verification email here."
      footerText="Already verified?"
      footerAction={{ href: "/auth/login", label: "Back to login" }}
    >
      <ResendVerificationForm email={email} />
    </AuthPageShell>
  );
}
