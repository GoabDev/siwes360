"use client";

import { useDeferredValue, useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
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
import {
  useAdminSupervisorsQuery,
  useDeleteSupervisorMutation,
} from "@/features/admin/queries/admin-supervisor-queries";
import { getApiErrorMessage } from "@/lib/api/error";

export function AdminSupervisorsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingRemoval, setPendingRemoval] = useState<{
    id: string;
    fullName: string;
  } | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const supervisorsQuery = useAdminSupervisorsQuery({
    pageNumber,
    pageSize,
    searchTerm: deferredSearchTerm,
  });
  const deleteMutation = useDeleteSupervisorMutation();

  const handleDelete = async () => {
    if (!pendingRemoval) {
      return;
    }

    try {
      await toast.promise(deleteMutation.mutateAsync(pendingRemoval.id), {
        loading: "Removing supervisor...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to remove supervisor."),
      });

      setPendingRemoval(null);
    } catch {
      return;
    }
  };

  if (supervisorsQuery.isLoading) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Supervisors</p>
        <h3 className="text-xl font-semibold">Loading supervisors</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather the current supervisor list.
        </p>
      </SurfaceCard>
    );
  }

  const data = supervisorsQuery.data;

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
            placeholder="Search by name, email, or department"
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
          No supervisors are currently available for this view.
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
          placeholder="Search by name, email, or department"
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

      <div className="hidden grid-cols-[1.1fr_1.2fr_1fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
        <span>Name</span>
        <span>Email</span>
        <span>Department</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-border/60">
        {data.items.map((supervisor) => (
          <div
            key={supervisor.id}
            className="px-5 py-4 text-sm"
          >
            <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 lg:hidden">
              <div>
                <p className="font-medium">{supervisor.fullName}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Email</p>
                  <p className="mt-1 break-words text-muted">{supervisor.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Department</p>
                  <p className="mt-1">{supervisor.department}</p>
                </div>
              </div>
              <div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPendingRemoval({
                      id: supervisor.id,
                      fullName: supervisor.fullName,
                    })
                  }
                  disabled={deleteMutation.isPending}
                >
                  Remove
                </Button>
              </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1.1fr_1.2fr_1fr_0.9fr] lg:gap-4">
              <div>
                <p className="font-medium">{supervisor.fullName}</p>
              </div>
              <span className="text-muted">{supervisor.email}</span>
              <span>{supervisor.department}</span>
              <div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPendingRemoval({
                      id: supervisor.id,
                      fullName: supervisor.fullName,
                    })
                  }
                  disabled={deleteMutation.isPending}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          Page {data.pageNumber} of {data.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((value) => Math.max(1, value - 1))}
            disabled={!data.hasPreviousPage || supervisorsQuery.isFetching}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((value) => value + 1)}
            disabled={!data.hasNextPage || supervisorsQuery.isFetching}
          >
            Next
          </Button>
        </div>
      </div>

      {pendingRemoval ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4 py-8 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setPendingRemoval(null)}
            aria-hidden="true"
          />
          <section className="relative w-full max-w-md rounded-[2rem] border border-border/80 bg-surface p-6 shadow-[0_30px_120px_rgba(17,75,55,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <TriangleAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-destructive">
                    Remove supervisor
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">Confirm access removal</h3>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPendingRemoval(null)}
                aria-label="Close remove supervisor dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              This will remove <span className="font-medium text-foreground">{pendingRemoval.fullName}</span>
              {" "}from supervisor access. This action should only be used when the account should no
              longer remain active.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Removing..." : "Remove supervisor"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPendingRemoval(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
