import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export function RegisterPageView() {
  return (
    <AuthPageShell
      eyebrow="Onboarding"
      title="Create a SIWES 360 account"
      description="This form is now wired for validation and can be connected to live backend onboarding without changing the route layer."
      footerText="Already have an account?"
      footerAction={{ href: "/auth/login", label: "Log in" }}
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
