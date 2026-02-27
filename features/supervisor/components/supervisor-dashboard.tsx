import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";

const supervisorStats = [
  {
    label: "Assigned reviews",
    value: "18",
    detail: "Students expected to receive supervision scoring.",
  },
  {
    label: "Scores submitted",
    value: "7",
    detail: "Completed supervision evaluations in this cycle.",
  },
  {
    label: "Pending visit follow-up",
    value: "11",
    detail: "Students still awaiting scoring after workplace visits.",
  },
];

export function SupervisorDashboardView() {
  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Supervisor"
        title="Submit supervision assessments without losing student context"
        description="This workspace is reserved for search, review, and score-entry flows tied to matric-number lookup."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {supervisorStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
    </div>
  );
}
