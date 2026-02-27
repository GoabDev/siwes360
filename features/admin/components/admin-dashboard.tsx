import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";

const adminStats = [
  {
    label: "Department students",
    value: "142",
    detail: "Students currently mapped to this admin's department.",
  },
  {
    label: "Logbook pending",
    value: "39",
    detail: "Students still awaiting logbook scoring.",
  },
  {
    label: "Ready for completion",
    value: "24",
    detail: "Records with enough data to finalize grading once remaining scores arrive.",
  },
];

export function AdminDashboardView() {
  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Admin"
        title="Oversee department-based grading with clear status visibility"
        description="This dashboard establishes the admin workspace for student lists, score entry, and final grading oversight."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {adminStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
    </div>
  );
}
