import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export function LoginPageView() {
  return (
    <AuthPageShell
      eyebrow="Portal access"
      title="Sign in to SIWES 360"
      description="Authenticate once and continue to your role-specific dashboard when backend auth is connected."
      footerText="Not verified?"
      footerAction={{ href: "/auth/verify-email", label: "Verify Email" }}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
