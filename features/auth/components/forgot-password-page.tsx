import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export function ForgotPasswordPageView() {
  return (
    <AuthPageShell
      eyebrow="Recovery"
      title="Reset account access"
      description="This flow is ready for backend recovery integration and already handles validation and async feedback."
      footerText="Remember your password?"
      footerAction={{ href: "/auth/login", label: "Back to login" }}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
