"use client";

import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  useAdminDepartmentsQuery,
  useDeleteDepartmentMutation,
} from "@/features/admin/queries/admin-department-queries";
import type { AdminDepartmentRecord } from "@/features/admin/types/admin-departments";
import { getApiErrorMessage } from "@/lib/api/error";

type AdminDepartmentsTableProps = {
  onEdit: (department: AdminDepartmentRecord) => void;
};

export function AdminDepartmentsTable({ onEdit }: AdminDepartmentsTableProps) {
  const departmentsQuery = useAdminDepartmentsQuery();
  const deleteMutation = useDeleteDepartmentMutation();
  const [pendingDelete, setPendingDelete] = useState<AdminDepartmentRecord | null>(null);

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await toast.promise(deleteMutation.mutateAsync(pendingDelete.id), {
        loading: "Deleting department...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to delete department."),
      });
      setPendingDelete(null);
    } catch {
      return;
    }
  };

  if (departmentsQuery.isLoading) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Departments</p>
        <h3 className="text-xl font-semibold">Loading departments</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather your current department list.
        </p>
      </SurfaceCard>
    );
  }

  const departments = departmentsQuery.data ?? [];

  if (!departments.length) {
    return (
      <SurfaceCard>
        <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
          No departments have been created yet.
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-0 overflow-hidden p-0">
      <div className="hidden grid-cols-[1.1fr_1.2fr_0.9fr_0.9fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
        <span>Department</span>
        <span>Administrator</span>
        <span>Created</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-border/60">
        {departments.map((department) => (
          <div
            key={department.id}
            className="px-5 py-4 text-sm"
          >
            <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 lg:hidden">
              <div>
                <p className="font-medium">{department.name}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Administrator</p>
                  <p className="mt-1 text-muted">{department.adminEmail ?? "No admin assigned"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Created</p>
                  <p className="mt-1">{department.createdAt ? new Date(department.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onEdit(department)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPendingDelete(department)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1.1fr_1.2fr_0.9fr_0.9fr] lg:gap-4">
              <div>
                <p className="font-medium">{department.name}</p>
              </div>
              <span className="text-muted">{department.adminEmail ?? "No admin assigned"}</span>
              <span>{department.createdAt ? new Date(department.createdAt).toLocaleDateString() : "N/A"}</span>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onEdit(department)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setPendingDelete(department)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4 py-8 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setPendingDelete(null)} aria-hidden="true" />
          <section className="relative w-full max-w-md rounded-[2rem] border border-border/80 bg-surface p-6 shadow-[0_30px_120px_rgba(17,75,55,0.12)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <TriangleAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-destructive">
                  Delete department
                </p>
                <h3 className="mt-1 text-xl font-semibold">Confirm department removal</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{pendingDelete.name}</span>.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete department"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPendingDelete(null)}
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
