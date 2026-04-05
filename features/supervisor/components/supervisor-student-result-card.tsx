import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { SupervisorStudentRecord } from "@/features/supervisor/types/supervisor-students";

type SupervisorStudentResultCardProps = {
  student: SupervisorStudentRecord | null;
  searchedMatricNumber?: string;
};

export function SupervisorStudentResultCard({
  student,
  searchedMatricNumber,
}: SupervisorStudentResultCardProps) {
  if (!searchedMatricNumber) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">
          Search by matric number to find a student and enter a supervision score.
        </p>
      </SurfaceCard>
    );
  }

  if (!student) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">
          No student was found for <span className="font-medium text-foreground">{searchedMatricNumber}</span>.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Student details</p>
          <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
        </div>
        <StatusBadge
          label={
            student.status === "finalized"
              ? "Finalized"
              : student.status === "scored"
                ? "Already scored"
                : "Pending score"
          }
          variant={
            student.status === "finalized"
              ? "success"
              : student.status === "scored"
                ? "warning"
                : "pending"
          }
        />
      </div>

      <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
        <p>Matric number: <span className="text-foreground">{student.matricNumber}</span></p>
        <p>Department: <span className="text-foreground">{student.department}</span></p>
        <p>Email: <span className="text-foreground">{student.email}</span></p>
        <p>Report score: <span className="text-foreground">{student.reportScore ?? "Pending"} / 30</span></p>
        <p>Supervisor score: <span className="text-foreground">{student.supervisorScore ?? "Pending"} / 10</span></p>
        <p>Total: <span className="text-foreground">{student.isComplete ? `${student.totalScore} / 100` : "Incomplete"}</span></p>
      </div>

      <Button asChild className="w-full md:w-auto">
        <Link href={`/supervisor/score-entry/${encodeURIComponent(student.matricNumber)}`}>
          {student.status === "finalized"
            ? "View record"
            : student.status === "scored"
              ? "Review score entry"
              : "Enter score"}
        </Link>
      </Button>
    </SurfaceCard>
  );
}
