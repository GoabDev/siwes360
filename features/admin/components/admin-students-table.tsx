"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAdminStudentsQuery } from "@/features/admin/queries/admin-student-queries";

function scoreValue(value: number | null, max: number) {
  return value === null ? `Pending / ${max}` : `${value} / ${max}`;
}

export function AdminStudentsTable() {
  const studentsQuery = useAdminStudentsQuery();

  if (studentsQuery.isLoading) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">Loading department students...</p>
      </SurfaceCard>
    );
  }

  if (!studentsQuery.data?.length) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">No students are currently available for this department.</p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="overflow-hidden p-0">
      <div className="grid grid-cols-[1.25fr_0.9fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted">
        <span>Name</span>
        <span>Matric</span>
        <span>Report</span>
        <span>Supervisor</span>
        <span>Logbook</span>
        <span>Presentation</span>
        <span>Total</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-border/60">
        {studentsQuery.data.map((student) => (
          <div
            key={student.matricNumber}
            className="grid grid-cols-[1.25fr_0.9fr_0.7fr_0.7fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-4 px-5 py-4 text-sm"
          >
            <div>
              <p className="font-medium">{student.fullName}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-muted">{student.department}</p>
                <StatusBadge
                  label={student.status}
                  variant={
                    student.status === "complete"
                      ? "success"
                      : student.status === "ready"
                        ? "warning"
                        : "pending"
                  }
                />
              </div>
            </div>
            <span className="text-muted">{student.matricNumber}</span>
            <span>{scoreValue(student.reportScore, 30)}</span>
            <span>{scoreValue(student.supervisorScore, 10)}</span>
            <span>{scoreValue(student.logbookScore, 30)}</span>
            <span>{scoreValue(student.presentationScore, 30)}</span>
            <span>{student.totalScore === null ? "Incomplete" : `${student.totalScore} / 100`}</span>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/score-entry/${encodeURIComponent(student.matricNumber)}`}>
                {student.logbookScore !== null || student.presentationScore !== null ? "Edit" : "Grade"}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
