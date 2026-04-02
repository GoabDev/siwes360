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
      <SurfaceCard>
        <p className="text-sm text-muted">Loading assigned students...</p>
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
        <p className="text-sm text-muted">
          No students are currently available for supervision in your department.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4 overflow-hidden p-0">
      <div className="flex flex-col gap-3 px-5 pt-5 md:flex-row md:items-center md:justify-between">
        <Input
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPageNumber(1);
          }}
          placeholder="Search by name or matric number"
          className="max-w-xl"
        />
        <span className="text-sm text-muted">
          Showing {studentsQuery.data.items.length} of {studentsQuery.data.totalCount}
        </span>
      </div>

      <div className="grid grid-cols-[1.2fr_0.85fr_0.8fr_1fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted">
        <span>Name</span>
        <span>Matric</span>
        <span>Status</span>
        <span>Placement</span>
        <span>Action</span>
      </div>

      <div className="divide-y divide-border/60">
        {studentsQuery.data.items.map((student) => (
          <div
            key={student.matricNumber}
            className="grid grid-cols-[1.2fr_0.85fr_0.8fr_1fr_0.9fr] gap-4 px-5 py-4 text-sm"
          >
            <div>
              <p className="font-medium">{student.fullName}</p>
              <p className="mt-1 text-xs text-muted">{student.department}</p>
            </div>
            <span className="text-muted">{student.matricNumber}</span>
            <div className="flex items-start">
              <StatusBadge
                label={student.status === "scored" ? "Scored" : "Pending"}
                variant={student.status === "scored" ? "success" : "pending"}
              />
            </div>
            <div>
              <p>{student.placementCompany}</p>
              <p className="mt-1 text-xs text-muted">{student.placementAddress}</p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/supervisor/score-entry/${encodeURIComponent(student.matricNumber)}`}>
                {student.status === "scored" ? "Review" : "Score"}
              </Link>
            </Button>
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
