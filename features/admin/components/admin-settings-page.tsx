import Link from "next/link";
import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminSettingsPageViewProps = {
  basePath?: string;
  scope?: AdminWorkspaceScope;
};

export function AdminSettingsPageView({
  basePath = "/admin",
  scope = "department",
}: AdminSettingsPageViewProps) {
  const quickLinks =
    scope === "global"
      ? [
          {
            href: `${basePath}/departments`,
            label: "Departments",
            description: "Create departments, assign administrators, and maintain platform structure.",
          },
          {
            href: `${basePath}/administrators`,
            label: "Administrators",
            description: "Review administrator coverage across departments and audit access.",
          },
          {
            href: `${basePath}/reports`,
            label: "Global reports",
            description: "Export results and monitor readiness across every department.",
          },
        ]
      : [
          {
            href: `${basePath}/profile`,
            label: "Profile",
            description: "Keep your account details current so supervisors and students see the right owner.",
          },
          {
            href: `${basePath}/students`,
            label: "Students",
            description: "Open student records quickly when you need to resolve grading blockers.",
          },
          {
            href: `${basePath}/reports`,
            label: "Reports",
            description: "Track departmental grading progress and export finalized outcomes.",
          },
        ];

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Settings"
        title={scope === "global" ? "Configure the platform workspace" : "Review your workspace controls"}
        description={
          scope === "global"
            ? "Use this area to jump into global administration tasks and keep cross-department operations aligned."
            : "Use this area to reach the main operational pages tied to your department workspace."
        }
      />

      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Quick actions</p>
          <h3 className="mt-1 text-xl font-semibold">
            {scope === "global" ? "Platform administration shortcuts" : "Department administration shortcuts"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            {scope === "global"
              ? "Super administrators can use these entry points to manage global records without hunting through the navigation."
              : "Department administrators can use these shortcuts to keep grading work moving and account details accurate."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[1.35rem] border border-border/70 bg-background/60 p-5 transition hover:border-brand/50 hover:bg-background/80"
            >
              <p className="text-sm font-semibold text-foreground">{link.label}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{link.description}</p>
            </Link>
          ))}
        </div>
      </SurfaceCard>
    </section>
  );
}
