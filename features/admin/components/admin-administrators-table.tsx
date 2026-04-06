"use client";

import { useDeferredValue, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useAdminAdministratorsQuery } from "@/features/admin/queries/admin-administrator-queries";

export function AdminAdministratorsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const administratorsQuery = useAdminAdministratorsQuery({
    pageNumber,
    pageSize,
    searchTerm: deferredSearchTerm,
  });

  if (administratorsQuery.isLoading) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Administrators</p>
        <h3 className="text-xl font-semibold">Loading department administrators</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather the current administrator list.
        </p>
      </SurfaceCard>
    );
  }

  const data = administratorsQuery.data;

  if (!data?.items.length) {
    return (
      <SurfaceCard className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageNumber(1);
            }}
            placeholder="Search by email or department"
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
          No administrators are currently available for this view.
        </div>
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
          placeholder="Search by email or department"
          className="max-w-xl"
        />
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>
            Showing {data.items.length} of {data.totalCount}
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

      <div className="hidden grid-cols-[1.1fr_1.3fr_1fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
        <span>Administrator</span>
        <span>Email</span>
        <span>Department</span>
      </div>
      <div className="divide-y divide-border/60">
        {data.items.map((administrator) => (
          <div
            key={administrator.id}
            className="px-5 py-4 text-sm"
          >
            <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 lg:hidden">
              <div>
                <p className="font-medium">{administrator.fullName}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Email</p>
                  <p className="mt-1 break-words text-muted">{administrator.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Department</p>
                  <p className="mt-1">{administrator.department}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1.1fr_1.3fr_1fr] lg:gap-4">
              <div>
                <p className="font-medium">{administrator.fullName}</p>
              </div>
              <span className="text-muted">{administrator.email}</span>
              <span>{administrator.department}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          Page {data.pageNumber} of {data.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium transition hover:border-brand disabled:pointer-events-none disabled:opacity-50"
            onClick={() => setPageNumber((value) => Math.max(1, value - 1))}
            disabled={!data.hasPreviousPage || administratorsQuery.isFetching}
          >
            Previous
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium transition hover:border-brand disabled:pointer-events-none disabled:opacity-50"
            onClick={() => setPageNumber((value) => value + 1)}
            disabled={!data.hasNextPage || administratorsQuery.isFetching}
          >
            Next
          </button>
        </div>
      </div>
    </SurfaceCard>
  );
}
