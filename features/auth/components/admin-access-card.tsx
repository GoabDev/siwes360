import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";

export function AdminAccessCard() {
  return (
    <SurfaceCard className="space-y-5">
      <SectionHeading
        eyebrow="Admin access"
        title="Administrator accounts are not public self-registration accounts"
        description="According to the project documentation, departmental admin accounts are pre-created by the system developer. Public admin sign-up should not be treated like student registration."
      />

      <div className="space-y-3 text-sm leading-6 text-muted">
        <p>
          If you are a department administrator, use your assigned credentials to log in.
        </p>
        <p>
          If first-time setup is needed later, it should be handled as an admin access or profile-completion flow, not as open public registration.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/auth/login">Go to login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </SurfaceCard>
  );
}
