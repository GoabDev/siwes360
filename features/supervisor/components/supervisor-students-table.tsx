"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useSupervisorStudentsQuery } from "@/features/supervisor/queries/supervisor-student-queries";

export function SupervisorStudentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const studentsQuery = useSupervisorStudentsQuery({
    pageNumber,
    pageSize: 10,
    searchTerm: deferredSearchTerm,
  });

  if (studentsQuery.isLoading) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Assigned students</p>
        <h3 className="text-xl font-semibold">Loading supervision list</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather the students currently assigned to you.
        </p>
      </SurfaceCard>
    );
  }

  if (!studentsQuery.data?.items.length) {
    return (
      <SurfaceCard className="space-y-4">
        <Input
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPageNumber(1);
          }}
          placeholder="Search by name or matric number"
          className="max-w-xl"
        />
        <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
          No students are currently available for supervision in your department.
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4 overflow-hidden p-0">
      <div className="flex flex-col gap-3 px-5 pt-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Supervision list</p>
          <h3 className="text-xl font-semibold">Open a student and submit scores</h3>
          <Input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageNumber(1);
            }}
            placeholder="Search by name or matric number"
            className="max-w-xl"
          />
        </div>
        <span className="text-sm text-muted">
          Showing {studentsQuery.data.items.length} of {studentsQuery.data.totalCount}
        </span>
      </div>

      <div className="hidden grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
        <span>Student</span>
        <span>Matric</span>
        <span>Status</span>
        <span>Report</span>
        <span>Total</span>
        <span>Action</span>
      </div>

      <div className="divide-y divide-border/60">
        {studentsQuery.data.items.map((student) => (
          <div
            key={student.matricNumber}
            className="grid gap-4 px-5 py-4 text-sm lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.9fr] lg:items-center"
          >
            <div>
              <p className="font-medium">{student.fullName}</p>
              <p className="mt-1 text-xs text-muted">{student.email}</p>
            </div>
            <div className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 lg:contents lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
              <p className="text-muted">
                <span className="text-xs font-medium uppercase tracking-[0.14em] lg:hidden">Matric </span>
                {student.matricNumber}
              </p>
              <div className="flex items-start">
                <StatusBadge
                  label={
                    student.status === "finalized"
                      ? "Finalized"
                      : student.status === "scored"
                        ? "Scored"
                        : "Pending"
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
              <p>
                <span className="text-xs font-medium uppercase tracking-[0.14em] lg:hidden">Report </span>
                {student.reportScore === null ? "Pending / 30" : `${student.reportScore} / 30`}
              </p>
              <p>
                <span className="text-xs font-medium uppercase tracking-[0.14em] lg:hidden">Total </span>
                {student.isComplete ? `${student.totalScore} / 100` : "Incomplete"}
              </p>
              <Button asChild size="sm" variant="outline" className="w-full lg:w-auto">
                <Link href={`/supervisor/score-entry/${encodeURIComponent(student.matricNumber)}`}>
                  {student.status === "finalized" ? "View record" : student.status === "scored" ? "Review score" : "Enter score"}
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          Page {studentsQuery.data.pageNumber} of {studentsQuery.data.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((value) => Math.max(1, value - 1))}
            disabled={studentsQuery.data.pageNumber <= 1 || studentsQuery.isFetching}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPageNumber((value) =>
                Math.min(studentsQuery.data.totalPages, value + 1),
              )
            }
            disabled={
              studentsQuery.data.pageNumber >= studentsQuery.data.totalPages ||
              studentsQuery.isFetching
            }
          >
            Next
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
