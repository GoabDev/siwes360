"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAdminStudentsQuery } from "@/features/admin/queries/admin-student-queries";

export function AdminDashboardView() {
  const studentsQuery = useAdminStudentsQuery();
  const students = studentsQuery.data?.items ?? [];
  const attentionQueue = students
    .filter((student) => student.totalScore === null || !student.isFinalized)
    .slice(0, 3);

  const stats = [
    {
      label: "Department students",
      value: `${studentsQuery.data?.totalCount ?? students.length}`,
      detail: "Students currently available for review in your department.",
    },
    {
      label: "Pending admin grading",
      value: `${students.filter((student) => student.logbookScore === null || student.presentationScore === null).length}`,
      detail: "Students still waiting for logbook or presentation scores.",
    },
    {
      label: "Ready for completion",
      value: `${students.filter((student) => student.reportScore !== null && student.supervisorScore !== null).length}`,
      detail: "Students with enough scoring progress for the final admin stage.",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Admin"
        title="Manage department grading from one clear workspace"
        description="Review students, complete scores, and keep an eye on which results are nearly ready to finalize."
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
          <p className="mt-2 text-sm leading-6 text-muted">
            Start with the students below if you want to move grading forward quickly.
          </p>
        </div>
        <div className="grid gap-3">
          {attentionQueue.length ? (
            attentionQueue.map((student) => (
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
                    ? "Still awaiting full scoring"
                    : student.isFinalized
                      ? `Finalized at ${student.totalScore} / 100`
                      : `Current total: ${student.totalScore} / 100`}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 px-4 py-4 text-sm text-muted">
              No students need immediate admin action right now.
            </div>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
