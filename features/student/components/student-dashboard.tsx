import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";

const studentStats = [
  {
    label: "Profile completion",
    value: "62%",
    detail: "Placement details and contact fields still pending.",
  },
  {
    label: "Report status",
    value: "Awaiting upload",
    detail: "No SIWES report has been submitted yet.",
  },
  {
    label: "Score visibility",
    value: "0 / 100",
    detail: "Final grading remains locked until score components are submitted.",
  },
];

export function StudentDashboardView() {
  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Student"
        title="Track your SIWES progress from onboarding to final grading"
        description="This dashboard will evolve into the main student workspace for report submission, status tracking, and score review."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {studentStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
    </div>
  );
}
