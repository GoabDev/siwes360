"use client";

import { Building2, CheckCircle2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminDepartmentRecord } from "@/features/admin/types/admin-departments";

type SuperAdminDepartmentGateProps = {
  departments: AdminDepartmentRecord[];
  isLoading: boolean;
  isOpen: boolean;
  selectedDepartmentId: string;
  onSelectDepartment: (departmentId: string) => void;
  onClose?: () => void;
};

export function SuperAdminDepartmentGate({
  departments,
  isLoading,
  isOpen,
  selectedDepartmentId,
  onSelectDepartment,
  onClose,
}: SuperAdminDepartmentGateProps) {
  const [draftDepartmentId, setDraftDepartmentId] = useState(selectedDepartmentId);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return departments;
    }

    return departments.filter((department) => {
      const adminEmail = department.adminEmail?.toLowerCase() ?? "";

      return (
        department.name.toLowerCase().includes(normalizedSearchTerm) ||
        adminEmail.includes(normalizedSearchTerm)
      );
    });
  }, [departments, searchTerm]);

  const selectedDepartment = departments.find((department) => department.id === draftDepartmentId) ?? null;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(29,40,36,0.28)] px-4 py-6 backdrop-blur-md sm:px-6 sm:py-8">
      <section className="mx-auto flex max-h-[min(88vh,760px)] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-[rgba(197,186,161,0.55)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98),rgba(250,245,234,0.96))] shadow-[0_30px_120px_rgba(24,48,40,0.22)]">
        <div className="border-b border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(19,120,89,0.15),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.2))] px-6 py-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-brand/12 text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Department Required
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Choose the department you want to work in
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                Super admin reporting is still finalized per department. Pick one department to load
                its finalize preview, exports, and grading summaries.
              </p>
            </div>
            {onClose ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-2xl"
                onClick={onClose}
                aria-label="Close department selector"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search departments or administrator email"
                  className="h-12 rounded-[1.1rem] border-border/70 bg-white/75 pl-11 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                />
              </div>

              <div className="rounded-[1.5rem] border border-border/70 bg-white/58 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <div className="max-h-[min(48vh,420px)] space-y-2 overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-background/60 px-4 py-5 text-sm text-muted">
                      Loading departments...
                    </div>
                  ) : !departments.length ? (
                    <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-background/60 px-4 py-5 text-sm text-muted">
                      No departments are available yet.
                    </div>
                  ) : !filteredDepartments.length ? (
                    <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-background/60 px-4 py-5 text-sm text-muted">
                      No department matches your search yet.
                    </div>
                  ) : (
                    filteredDepartments.map((department) => {
                      const isSelected = draftDepartmentId === department.id;

                      return (
                        <button
                          key={department.id}
                          type="button"
                          onClick={() => setDraftDepartmentId(department.id)}
                          className={`flex w-full items-start justify-between gap-4 rounded-[1.2rem] border px-4 py-4 text-left transition ${
                            isSelected
                              ? "border-brand/60 bg-[linear-gradient(180deg,rgba(19,120,89,0.1),rgba(19,120,89,0.04))] shadow-[0_12px_30px_rgba(19,120,89,0.12)]"
                              : "border-border/70 bg-[rgba(255,252,246,0.92)] hover:border-brand/35 hover:bg-white"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{department.name}</p>
                            <p className="mt-1 truncate text-sm text-muted">
                              {department.adminEmail ?? "No administrator assigned yet"}
                            </p>
                          </div>
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-brand/60 bg-brand text-white"
                                : "border-border/70 bg-white/80 text-transparent"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <aside className="flex flex-col justify-between rounded-[1.6rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,243,232,0.82))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Current Selection
                </p>
                {selectedDepartment ? (
                  <div className="mt-4 rounded-[1.35rem] border border-brand/20 bg-white/80 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{selectedDepartment.name}</p>
                        <p className="mt-1 break-all text-sm text-muted">
                          {selectedDepartment.adminEmail ?? "No administrator assigned yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-[1.35rem] border border-dashed border-border/70 bg-white/50 p-4 text-sm leading-6 text-muted">
                    Select a department from the list to continue into its reporting workspace.
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[1.2rem] bg-[rgba(19,120,89,0.06)] px-4 py-3 text-sm leading-6 text-muted">
                  Your selection is saved for this browser session so exports, finalize preview, and
                  assessment summary requests stay aligned to one department.
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    className="h-12 w-full rounded-[1rem]"
                    disabled={!draftDepartmentId}
                    onClick={() => onSelectDepartment(draftDepartmentId)}
                  >
                    Continue with selected department
                  </Button>
                  {onClose ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full rounded-[1rem]"
                      onClick={onClose}
                    >
                      Keep current department
                    </Button>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
