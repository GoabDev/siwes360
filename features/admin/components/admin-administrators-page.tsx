"use client";

import { DashboardHero } from "@/components/ui/dashboard-hero";
import { SurfaceCard } from "@/components/ui/surface-card";
import { AdminAdministratorsTable } from "@/features/admin/components/admin-administrators-table";

export function AdminAdministratorsPageView() {
  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Department administrators"
        title="Review administrator coverage across departments"
        description="Track administrator accounts by department and search the current administrator directory from one place."
      />
      <SurfaceCard className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
            Department administrators
          </p>
          <h3 className="mt-1 text-xl font-semibold">Administrator directory</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Search the administrator list by email or department and review which departments
            already have designated admin accounts.
          </p>
        </div>
      </SurfaceCard>
      <AdminAdministratorsTable />
    </section>
  );
}
