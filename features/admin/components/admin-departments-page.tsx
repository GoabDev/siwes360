"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { AdminDepartmentsTable } from "@/features/admin/components/admin-departments-table";
import { DepartmentDialog } from "@/features/admin/components/department-dialog";
import type { AdminDepartmentRecord } from "@/features/admin/types/admin-departments";

export function AdminDepartmentsPageView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState<AdminDepartmentRecord | null>(null);

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Departments"
        title="Create and maintain department records"
        description="Manage department names and assign the correct administrator account to each department."
      />
      <SurfaceCard className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
            Department directory
          </p>
          <h3 className="mt-1 text-xl font-semibold">Department management</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Use this page to add new departments, correct department details, and keep admin
            assignments aligned with the backend records.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setActiveDepartment(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Create department
        </Button>
      </SurfaceCard>
      <AdminDepartmentsTable
        onEdit={(department) => {
          setActiveDepartment(department);
          setIsDialogOpen(true);
        }}
      />
      <DepartmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        department={activeDepartment}
      />
    </section>
  );
}
