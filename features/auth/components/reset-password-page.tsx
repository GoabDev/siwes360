import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

type ResetPasswordPageViewProps = {
  userId?: string;
  token?: string;
};

export function ResetPasswordPageView({ userId, token }: ResetPasswordPageViewProps) {
  return (
    <AuthPageShell
      eyebrow="Password recovery"
      title="Create a new password"
      description="Use the reset link from your email to choose a new password for your account."
      footerText="Remembered your password?"
      footerAction={{ href: "/auth/login", label: "Go to login" }}
    >
      <ResetPasswordForm userId={userId} token={token} />
    </AuthPageShell>
  );
}
