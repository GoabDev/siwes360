"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { StatCard } from "@/components/ui/stat-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useSupervisorStudentsQuery } from "@/features/supervisor/queries/supervisor-student-queries";

export function SupervisorDashboardView() {
  const studentsQuery = useSupervisorStudentsQuery({
    pageNumber: 1,
    pageSize: 100,
    searchTerm: "",
  });

  if (studentsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Supervisor"
          title="Review students and submit supervision scores"
          description="See the students assigned to you, enter scores, and keep track of what is still pending."
        />
        <SurfaceCard>
          <p className="text-sm text-muted">Loading your supervision overview...</p>
        </SurfaceCard>
      </div>
    );
  }

  const students = studentsQuery.data?.items ?? [];
  const scored = students.filter((student) => student.supervisorScore !== null).length;
  const finalized = students.filter((student) => student.isFinalized).length;
  const pending = students.filter(
    (student) => student.supervisorScore === null && !student.isFinalized,
  ).length;
  const nextStudents = students.filter((student) => !student.isFinalized).slice(0, 3);

  const supervisorStats = [
    {
      label: "Assigned reviews",
      value: String(studentsQuery.data?.totalCount ?? students.length),
      detail: "Students currently assigned to you for supervision review.",
    },
    {
      label: "Scores submitted",
      value: String(scored),
      detail: "Students you have already scored.",
    },
    {
      label: "Pending scoring",
      value: String(pending),
      detail: "Students who still need a supervision score.",
    },
    {
      label: "Finalized records",
      value: String(finalized),
      detail: "Students whose results have already been finalized.",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Supervisor"
        title="Review students and submit supervision scores"
        description="See the students assigned to you, enter scores, and keep track of what is still pending."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {supervisorStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Next to review</p>
          <h3 className="mt-1 text-xl font-semibold">Students who may need your attention</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use this short list to jump into the next supervision tasks quickly.
          </p>
        </div>
        {nextStudents.length ? (
          <div className="grid gap-3">
            {nextStudents.map((student) => (
              <div
                key={student.matricNumber}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{student.fullName}</p>
                  <p className="text-sm text-muted">
                    {student.matricNumber} • {student.email}
                  </p>
                </div>
                <p className="text-sm text-muted">
                  {student.supervisorScore === null
                    ? "Supervisor score still pending"
                    : `Current supervisor score: ${student.supervisorScore} / 10`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 px-4 py-4 text-sm text-muted">
            No open supervision tasks are waiting for you right now.
          </div>
        )}
      </SurfaceCard>
    </div>
  );
}
