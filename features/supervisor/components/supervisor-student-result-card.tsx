import Link from "next/link";
import { Button } from "@/components/ui/button";
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
          Search by matric number to retrieve a student record for supervision scoring.
        </p>
      </SurfaceCard>
    );
  }

  if (!student) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">
          No student record was found for <span className="font-medium text-foreground">{searchedMatricNumber}</span>.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Student record</p>
          <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
          {student.status === "scored" ? "Already scored" : "Pending score"}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
        <p>Matric number: <span className="text-foreground">{student.matricNumber}</span></p>
        <p>Department: <span className="text-foreground">{student.department}</span></p>
        <p>Placement: <span className="text-foreground">{student.placementCompany}</span></p>
        <p>Address: <span className="text-foreground">{student.placementAddress}</span></p>
      </div>

      <Button asChild className="w-full md:w-auto">
        <Link href={`/supervisor/score-entry/${encodeURIComponent(student.matricNumber)}`}>
          {student.status === "scored" ? "Review score entry" : "Enter score"}
        </Link>
      </Button>
    </SurfaceCard>
  );
}
