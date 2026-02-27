"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAdminStudentsQuery } from "@/features/admin/queries/admin-student-queries";

export function AdminDashboardView() {
  const studentsQuery = useAdminStudentsQuery();
  const students = studentsQuery.data ?? [];

  const stats = [
    {
      label: "Department students",
      value: `${students.length}`,
      detail: "Students currently available in this department grading workspace.",
    },
    {
      label: "Pending admin grading",
      value: `${students.filter((student) => student.logbookScore === null || student.presentationScore === null).length}`,
      detail: "Students still waiting on logbook and presentation completion.",
    },
    {
      label: "Ready for completion",
      value: `${students.filter((student) => student.reportScore !== null && student.supervisorScore !== null).length}`,
      detail: "Records with enough upstream grading data for the admin stage to finish cleanly.",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Admin"
        title="Oversee department-based grading with clear status visibility"
        description="This dashboard establishes the admin workspace for student lists, score entry, and final grading oversight."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Attention queue</p>
          <h3 className="mt-1 text-xl font-semibold">Records needing the next admin action</h3>
        </div>
        <div className="grid gap-3">
          {students.slice(0, 3).map((student) => (
            <div
              key={student.matricNumber}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3"
            >
              <div>
                <p className="font-medium">{student.fullName}</p>
                <p className="text-sm text-muted">
                  {student.matricNumber} • {student.department}
                </p>
              </div>
              <p className="text-sm text-muted">
                {student.totalScore === null
                  ? "Still incomplete"
                  : `Current total: ${student.totalScore} / 100`}
              </p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
