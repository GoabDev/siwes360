import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export function LoginPageView() {
  return (
    <AuthPageShell
      eyebrow="Portal access"
      title="Sign in to SIWES 360"
      description="Sign in to continue to your SIWES dashboard."
      footerText="Not verified?"
      footerAction={{ href: "/auth/verify-email", label: "Verify Email" }}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
