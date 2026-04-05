"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAdminStudentsQuery } from "@/features/admin/queries/admin-student-queries";

export function AdminStudentsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const studentsQuery = useAdminStudentsQuery({
    pageNumber,
    pageSize,
    searchTerm: deferredSearchTerm,
  });

  if (studentsQuery.isLoading) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Students</p>
        <h3 className="text-xl font-semibold">Loading department students</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather the latest student list for your department.
        </p>
      </SurfaceCard>
    );
  }

  if (!studentsQuery.data?.items.length) {
    return (
      <SurfaceCard className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageNumber(1);
            }}
            placeholder="Search by name, matric number, email, or department"
            className="max-w-xl"
          />
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>Rows</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageNumber(1);
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
          No students are currently available for this department.
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4 overflow-hidden p-0">
      <div className="flex flex-col gap-3 px-5 pt-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Student directory</p>
          <h3 className="text-xl font-semibold">Browse and open student records</h3>
          <Input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageNumber(1);
            }}
            placeholder="Search by name, matric number, email, or department"
            className="max-w-xl"
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>
            Showing {studentsQuery.data.items.length} of {studentsQuery.data.totalCount}
          </span>
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageNumber(1);
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="hidden grid-cols-[1.15fr_0.9fr_1.1fr_0.9fr_0.8fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
        <span>Student</span>
        <span>Matric</span>
        <span>Email</span>
        <span>Department</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-border/60">
        {studentsQuery.data.items.map((student) => (
          <div
            key={student.matricNumber}
            className="grid gap-4 px-5 py-4 text-sm lg:grid-cols-[1.15fr_0.9fr_1.1fr_0.9fr_0.8fr] lg:items-center"
          >
            <div>
              <p className="font-medium">{student.fullName}</p>
              <p className="mt-1 text-xs text-muted">
                {student.studentId ?? "Student record"}
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 lg:contents lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
              <div className="grid gap-3 text-sm text-muted sm:grid-cols-3 lg:contents">
                <p>
                  <span className="text-xs font-medium uppercase tracking-[0.14em] lg:hidden">Matric </span>
                  {student.matricNumber || "N/A"}
                </p>
                <p className="min-w-0">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] lg:hidden">Email </span>
                  <span className="block truncate">{student.email || "N/A"}</span>
                </p>
                <p>
                  <span className="text-xs font-medium uppercase tracking-[0.14em] lg:hidden">Department </span>
                  {student.department}
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="w-full lg:w-auto">
                <Link href={`/admin/students/${encodeURIComponent(student.matricNumber)}`}>
                  Open record
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
