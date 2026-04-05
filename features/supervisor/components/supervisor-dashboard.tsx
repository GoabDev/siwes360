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
          title="Submit supervision assessments without losing student context"
          description="This workspace is reserved for search, review, and score-entry flows tied to live assessment records."
        />
        <SurfaceCard>
          <p className="text-sm text-muted">Loading supervision overview...</p>
        </SurfaceCard>
      </div>
    );
  }

  const students = studentsQuery.data?.items ?? [];
  const scored = students.filter((student) => student.supervisorScore !== null).length;
  const finalized = students.filter((student) => student.isFinalized).length;
  const pending = students.filter((student) => student.supervisorScore === null && !student.isFinalized).length;

  const supervisorStats = [
    {
      label: "Assigned reviews",
      value: String(studentsQuery.data?.totalCount ?? students.length),
      detail: "Assessment records currently visible in your department queue.",
    },
    {
      label: "Scores submitted",
      value: String(scored),
      detail: "Students whose supervisor score is already on record.",
    },
    {
      label: "Pending scoring",
      value: String(pending),
      detail: "Open assessment records that still need a supervisor score.",
    },
    {
      label: "Finalized records",
      value: String(finalized),
      detail: "Assessments locked after departmental finalization.",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Supervisor"
        title="Submit supervision assessments without losing student context"
        description="This workspace is reserved for search, review, and score-entry flows tied to live assessment records."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {supervisorStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
    </div>
  );
}
