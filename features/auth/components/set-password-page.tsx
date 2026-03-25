import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { SetPasswordForm } from "@/features/auth/components/set-password-form";

type SetPasswordPageViewProps = {
  userId?: string;
  token?: string;
};

export function SetPasswordPageView({ userId, token }: SetPasswordPageViewProps) {
  return (
    <AuthPageShell
      eyebrow="Supervisor invite"
      title="Create your password"
      description="Finish your supervisor invite by setting the password attached to the account created for you."
      footerText="Already completed this step?"
      footerAction={{ href: "/auth/login", label: "Go to login" }}
    >
      <SetPasswordForm userId={userId} token={token} />
    </AuthPageShell>
  );
}
