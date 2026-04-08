"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  useAdminAssessmentsQuery,
  useAdminFinalizePreviewQuery,
  useBulkFinalizeAssessmentsMutation,
  useExportDepartmentAssessmentCsvMutation,
  useExportDepartmentAssessmentPdfMutation,
} from "@/features/admin/queries/admin-assessment-queries";
import { useAdminDepartmentsQuery } from "@/features/admin/queries/admin-department-queries";
import { SuperAdminDepartmentGate } from "@/features/admin/components/superadmin-department-gate";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";
import { getApiErrorMessage } from "@/lib/api/error";

const SUPERADMIN_REPORTS_DEPARTMENT_KEY = "siwes360-superadmin-reports-department";

function formatScore(value: number | null, max: number) {
  return value == null ? `Pending / ${max}` : `${value} / ${max}`;
}

type AdminReportsOverviewProps = {
  basePath?: string;
  scope?: AdminWorkspaceScope;
};

function downloadExport(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function AdminReportsOverview({
  basePath = "/admin",
  scope = "department",
}: AdminReportsOverviewProps) {
  const [isDepartmentGateVisible, setIsDepartmentGateVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [finalizedFilter, setFinalizedFilter] = useState<"all" | "finalized" | "open">("all");
  const [departmentId, setDepartmentId] = useState<string>(() => {
    if (scope !== "global" || typeof window === "undefined") {
      return "";
    }

    return window.sessionStorage.getItem(SUPERADMIN_REPORTS_DEPARTMENT_KEY) ?? "";
  });
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const isFinalized =
    finalizedFilter === "all" ? null : finalizedFilter === "finalized";

  useEffect(() => {
    if (scope !== "global" || typeof window === "undefined") {
      return;
    }

    if (departmentId) {
      window.sessionStorage.setItem(SUPERADMIN_REPORTS_DEPARTMENT_KEY, departmentId);
      return;
    }

    window.sessionStorage.removeItem(SUPERADMIN_REPORTS_DEPARTMENT_KEY);
  }, [departmentId, scope]);

  const departmentsQuery = useAdminDepartmentsQuery(scope === "global");
  const hasDepartmentOptions = (departmentsQuery.data?.length ?? 0) > 0;
  const hasValidSelectedDepartment =
    scope !== "global" ||
    !hasDepartmentOptions ||
    (departmentsQuery.data ?? []).some((department) => department.id === departmentId);
  const effectiveDepartmentId =
    scope === "global" && hasValidSelectedDepartment ? departmentId : "";
  const effectiveSelectedDepartmentId =
    scope === "global" ? effectiveDepartmentId || null : null;
  const canRunEffectiveDepartmentScopedQueries =
    scope === "global" ? Boolean(effectiveSelectedDepartmentId) : true;

  const assessmentsQuery = useAdminAssessmentsQuery({
    pageNumber,
    pageSize,
    searchTerm: deferredSearchTerm,
    isFinalized,
    departmentId: effectiveSelectedDepartmentId,
  }, canRunEffectiveDepartmentScopedQueries);
  const previewQuery = useAdminFinalizePreviewQuery(
    deferredSearchTerm,
    effectiveSelectedDepartmentId,
    canRunEffectiveDepartmentScopedQueries,
  );
  const bulkFinalizeMutation = useBulkFinalizeAssessmentsMutation();
  const exportPdfMutation = useExportDepartmentAssessmentPdfMutation();
  const exportCsvMutation = useExportDepartmentAssessmentCsvMutation();

  useEffect(() => {
    if (scope !== "global" || typeof window === "undefined" || hasValidSelectedDepartment) {
      return;
    }

    window.sessionStorage.removeItem(SUPERADMIN_REPORTS_DEPARTMENT_KEY);
  }, [hasValidSelectedDepartment, scope]);

  function handleDepartmentSelection(nextDepartmentId: string) {
    setDepartmentId(nextDepartmentId);
    setPageNumber(1);
    setIsDepartmentGateVisible(false);
  }

  async function handleBulkFinalize() {
    if (scope === "global" && !effectiveSelectedDepartmentId) {
      toast.error("Select a department before finalizing assessments.");
      return;
    }

    try {
      await toast.promise(bulkFinalizeMutation.mutateAsync(effectiveSelectedDepartmentId), {
        loading:
          scope === "global"
            ? "Finalizing selected assessments..."
            : "Finalizing department assessments...",
        success: (data) =>
          `Finalized ${data.finalizedCount} assessment${data.finalizedCount === 1 ? "" : "s"}.`,
        error: (error) => getApiErrorMessage(error, "Unable to bulk finalize assessments."),
      });
    } catch {
      return;
    }
  }

  async function handleExportPdf() {
    if (scope === "global" && !effectiveSelectedDepartmentId) {
      toast.error("Select a department before exporting assessment PDFs.");
      return;
    }

    try {
      await toast.promise(exportPdfMutation.mutateAsync(effectiveSelectedDepartmentId), {
        loading: "Generating assessment PDF...",
        success: (data) => {
          downloadExport(data.blob, data.fileName);
          return "Assessment PDF exported successfully.";
        },
        error: (error) => getApiErrorMessage(error, "Unable to export assessment PDF."),
      });
    } catch {
      return;
    }
  }

  async function handleExportCsv() {
    if (scope === "global" && !effectiveSelectedDepartmentId) {
      toast.error("Select a department before exporting assessment CSV.");
      return;
    }

    try {
      await toast.promise(exportCsvMutation.mutateAsync(effectiveSelectedDepartmentId), {
        loading: "Generating assessment CSV...",
        success: (data) => {
          downloadExport(data.blob, data.fileName);
          return "Assessment CSV exported successfully.";
        },
        error: (error) => getApiErrorMessage(error, "Unable to export assessment CSV."),
      });
    } catch {
      return;
    }
  }

  if (
    assessmentsQuery.isLoading ||
    previewQuery.isLoading ||
    (scope === "global" && departmentsQuery.isLoading)
  ) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Reports overview</p>
        <h3 className="text-xl font-semibold">Loading department grading summary</h3>
        <p className="text-sm leading-6 text-muted">
          Please wait while we gather the latest scores and finalization status.
        </p>
      </SurfaceCard>
    );
  }

  const assessments = assessmentsQuery.data?.items ?? [];
  const preview = previewQuery.data;
  const isDepartmentGateOpen =
    scope === "global" &&
    !departmentsQuery.isLoading &&
    (!effectiveSelectedDepartmentId || isDepartmentGateVisible);

  return (
    <div className="space-y-4">
      <SuperAdminDepartmentGate
        key={`superadmin-reports-gate-${effectiveDepartmentId || "unselected"}`}
        departments={departmentsQuery.data ?? []}
        isLoading={departmentsQuery.isLoading}
        isOpen={isDepartmentGateOpen}
        selectedDepartmentId={effectiveDepartmentId}
        onSelectDepartment={handleDepartmentSelection}
        onClose={effectiveSelectedDepartmentId ? () => setIsDepartmentGateVisible(false) : undefined}
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Finalization overview</p>
            <h3 className="mt-1 text-xl font-semibold">
              {scope === "global" ? "Assessment readiness by scope" : "Department assessment readiness"}
            </h3>
            {scope === "global" && effectiveSelectedDepartmentId ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-brand" />
                  {(departmentsQuery.data ?? []).find((department) => department.id === effectiveSelectedDepartmentId)?.name ??
                    "Selected department"}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDepartmentGateVisible(true)}
                >
                  Switch department
                </Button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Ready</p>
              <p className="mt-2 text-2xl font-semibold">{preview?.readyCount ?? 0}</p>
            </div>
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Incomplete</p>
              <p className="mt-2 text-2xl font-semibold">{preview?.incompleteCount ?? 0}</p>
            </div>
            <div className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Already finalized</p>
              <p className="mt-2 text-2xl font-semibold">{preview?.alreadyFinalizedCount ?? 0}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleBulkFinalize}
              disabled={
                bulkFinalizeMutation.isPending ||
                Boolean(preview?.incompleteCount) ||
                (scope === "global" && !effectiveSelectedDepartmentId)
              }
            >
              {bulkFinalizeMutation.isPending ? "Finalizing..." : "Finalize ready assessments"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportPdf}
              disabled={exportPdfMutation.isPending || (scope === "global" && !effectiveSelectedDepartmentId)}
            >
              {exportPdfMutation.isPending ? "Exporting..." : "Export PDF"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportCsv}
              disabled={exportCsvMutation.isPending || (scope === "global" && !effectiveSelectedDepartmentId)}
            >
              {exportCsvMutation.isPending ? "Exporting..." : "Export CSV"}
            </Button>
            {preview?.incompleteCount ? (
              <p className="text-sm text-muted">
                Some assessments still need attention before you can finalize them together.
              </p>
            ) : null}
            {scope === "global" && !effectiveSelectedDepartmentId ? (
              <p className="text-sm text-muted">
                Choose a department to finalize its ready assessments in bulk.
              </p>
            ) : null}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Finalize preview</p>
            <h3 className="mt-1 text-xl font-semibold">Students who still need attention</h3>
          </div>
          {preview?.items.length ? (
            <div className="space-y-3">
              {preview.items.slice(0, 5).map((item) => (
                <div
                  key={item.assessmentId}
                  className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.fullName}</p>
                      <p className="text-xs text-muted">{item.matricNumber}</p>
                    </div>
                    <StatusBadge
                      label={item.status}
                      variant={
                        item.status === "Ready"
                          ? "success"
                          : item.status === "AlreadyFinalized"
                            ? "neutral"
                            : "warning"
                      }
                    />
                  </div>
                  {item.missingItems.length ? (
                    <p className="mt-3 text-sm text-muted">
                      Missing: <span className="text-foreground">{item.missingItems.join(", ")}</span>
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
              There is nothing to review here right now.
            </div>
          )}
        </SurfaceCard>
      </div>

      <SurfaceCard className="space-y-4 overflow-hidden p-0">
        <div className="flex flex-col gap-3 px-5 pt-5 md:flex-row md:items-center md:justify-between">
          <Input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageNumber(1);
            }}
            placeholder="Search by student name, email, or matric number"
            className="max-w-xl"
          />
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {scope === "global" ? (
              <>
                <Select
                  value={effectiveDepartmentId}
                  onValueChange={(value) => {
                    handleDepartmentSelection(value);
                  }}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {(departmentsQuery.data ?? []).map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDepartmentGateVisible(true)}
                >
                  <Building2 className="h-4 w-4" />
                  Change department
                </Button>
              </>
            ) : null}
            <Select
              value={finalizedFilter}
              onValueChange={(value: "all" | "finalized" | "open") => {
                setFinalizedFilter(value);
                setPageNumber(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                <SelectItem value="open">Open only</SelectItem>
                <SelectItem value="finalized">Finalized only</SelectItem>
              </SelectContent>
            </Select>
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

        {!effectiveSelectedDepartmentId && scope === "global" ? (
          <div className="px-5 pb-5">
            <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
              Select a department to load assessment summaries for this super admin report view.
            </div>
          </div>
        ) : !assessments.length ? (
          <div className="px-5 pb-5">
            <div className="rounded-[1.2rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
              No students matched your current search or filter.
            </div>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.2fr_0.72fr_0.78fr_0.78fr_0.8fr_0.7fr_0.55fr_0.82fr] gap-4 border-b border-border/70 bg-background/60 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-muted lg:grid">
              <span>Student</span>
              <span>Validation</span>
              <span>Report</span>
              <span>Supervisor</span>
              <span>Admin</span>
              <span>Total</span>
              <span>Grade</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-border/60">
              {assessments.map((assessment) => (
                <Link
                  key={assessment.assessmentId}
                  href={`${basePath}/students/${encodeURIComponent(assessment.matricNumber)}`}
                  className="block px-5 py-4 text-sm transition hover:bg-background/50"
                >
                  <div className="overflow-hidden rounded-[1.45rem] border border-border/70 bg-[linear-gradient(180deg,_rgba(255,253,247,0.96),_rgba(255,253,247,0.82))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] lg:hidden">
                    <div className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-4">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold leading-6">{assessment.fullName}</p>
                        <p className="mt-1 text-sm text-muted">{assessment.matricNumber}</p>
                      </div>
                      <StatusBadge
                        label={assessment.isFinalized ? "Finalized" : assessment.isComplete ? "Ready" : "Open"}
                        variant={
                          assessment.isFinalized
                            ? "success"
                            : assessment.isComplete
                              ? "warning"
                              : "pending"
                        }
                        className="shrink-0"
                      />
                    </div>
                    <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
                      {[
                        ["Validation", formatScore(assessment.documentValidationScore, 100)],
                        ["Report", formatScore(assessment.reportScore, 30)],
                        ["Supervisor", formatScore(assessment.supervisorScore, 10)],
                        [
                          "Admin",
                          assessment.logbookScore == null || assessment.presentationScore == null
                            ? "Pending"
                            : `${assessment.logbookScore + assessment.presentationScore} / 60`,
                        ],
                        ["Total", assessment.isComplete ? `${assessment.totalScore} / 100` : "Incomplete"],
                        ["Grade", assessment.grade ?? "Pending"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[1.1rem] border border-border/60 bg-background/70 px-3 py-3"
                        >
                          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {label}
                          </p>
                          <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="hidden lg:grid lg:grid-cols-[1.2fr_0.72fr_0.78fr_0.78fr_0.8fr_0.7fr_0.55fr_0.82fr] lg:gap-4">
                    <div>
                      <p className="font-medium">{assessment.fullName}</p>
                      <p className="text-xs text-muted">{assessment.matricNumber}</p>
                    </div>
                    <span>{formatScore(assessment.documentValidationScore, 100)}</span>
                    <span>{formatScore(assessment.reportScore, 30)}</span>
                    <span>{formatScore(assessment.supervisorScore, 10)}</span>
                    <span>
                      {assessment.logbookScore == null || assessment.presentationScore == null
                        ? "Pending"
                        : `${assessment.logbookScore + assessment.presentationScore} / 60`}
                    </span>
                    <span>{assessment.isComplete ? `${assessment.totalScore} / 100` : "Incomplete"}</span>
                    <span>{assessment.grade ?? "Pending"}</span>
                    <div className="flex items-start">
                      <StatusBadge
                        label={assessment.isFinalized ? "Finalized" : assessment.isComplete ? "Ready" : "Open"}
                        variant={
                          assessment.isFinalized
                            ? "success"
                            : assessment.isComplete
                              ? "warning"
                              : "pending"
                        }
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted">
            Page {assessmentsQuery.data?.pageNumber ?? 1} of {assessmentsQuery.data?.totalPages ?? 1}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((value) => Math.max(1, value - 1))}
              disabled={(assessmentsQuery.data?.pageNumber ?? 1) <= 1 || assessmentsQuery.isFetching}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setPageNumber((value) =>
                  Math.min(assessmentsQuery.data?.totalPages ?? value, value + 1),
                )
              }
              disabled={
                (assessmentsQuery.data?.pageNumber ?? 1) >= (assessmentsQuery.data?.totalPages ?? 1) ||
                assessmentsQuery.isFetching
              }
            >
              Next
            </Button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
