"use client";

import { SurfaceCard } from "@/components/ui/surface-card";
import { useAdminStudentsQuery } from "@/features/admin/queries/admin-student-queries";

export function AdminReportsOverview() {
  const studentsQuery = useAdminStudentsQuery();

  if (studentsQuery.isLoading) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">Loading report oversight data...</p>
      </SurfaceCard>
    );
  }

  const students = studentsQuery.data ?? [];
  const reportReady = students.filter((student) => student.reportScore !== null).length;
  const fullyComplete = students.filter((student) => student.status === "complete").length;

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Overview</p>
          <h3 className="mt-1 text-xl font-semibold">Department report coverage</h3>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Reports graded</p>
            <p className="mt-2 text-2xl font-semibold">{reportReady}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Fully complete records</p>
            <p className="mt-2 text-2xl font-semibold">{fullyComplete}</p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.2fr_0.7fr_0.9fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted">
          <span>Student</span>
          <span>Report</span>
          <span>Supervisor</span>
          <span>Admin</span>
        </div>
        <div className="divide-y divide-border/60">
          {students.map((student) => (
            <div
              key={student.matricNumber}
              className="grid grid-cols-[1.2fr_0.7fr_0.9fr_0.9fr] gap-4 px-5 py-4 text-sm"
            >
              <div>
                <p className="font-medium">{student.fullName}</p>
                <p className="text-xs text-muted">{student.matricNumber}</p>
              </div>
              <span>{student.reportScore === null ? "Pending" : `${student.reportScore}/30`}</span>
              <span>{student.supervisorScore === null ? "Pending" : `${student.supervisorScore}/10`}</span>
              <span>
                {student.logbookScore === null || student.presentationScore === null
                  ? "Pending"
                  : `${student.logbookScore + student.presentationScore}/60`}
              </span>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
