"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
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
  useExportDepartmentAssessmentPdfMutation,
} from "@/features/admin/queries/admin-assessment-queries";
import { getApiErrorMessage } from "@/lib/api/error";

function formatScore(value: number | null, max: number) {
  return value == null ? `Pending / ${max}` : `${value} / ${max}`;
}

export function AdminReportsOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [finalizedFilter, setFinalizedFilter] = useState<"all" | "finalized" | "open">("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const isFinalized =
    finalizedFilter === "all" ? null : finalizedFilter === "finalized";

  const assessmentsQuery = useAdminAssessmentsQuery({
    pageNumber,
    pageSize,
    searchTerm: deferredSearchTerm,
    isFinalized,
  });
  const previewQuery = useAdminFinalizePreviewQuery(deferredSearchTerm);
  const bulkFinalizeMutation = useBulkFinalizeAssessmentsMutation();
  const exportPdfMutation = useExportDepartmentAssessmentPdfMutation();

  async function handleBulkFinalize() {
    try {
      await toast.promise(bulkFinalizeMutation.mutateAsync(), {
        loading: "Finalizing department assessments...",
        success: (data) =>
          `Finalized ${data.finalizedCount} assessment${data.finalizedCount === 1 ? "" : "s"}.`,
        error: (error) => getApiErrorMessage(error, "Unable to bulk finalize assessments."),
      });
    } catch {
      return;
    }
  }

  async function handleExportPdf() {
    try {
      await toast.promise(exportPdfMutation.mutateAsync(), {
        loading: "Generating assessment PDF...",
        success: (data) => {
          const url = window.URL.createObjectURL(data.blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = data.fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          return "Assessment PDF exported successfully.";
        },
        error: (error) => getApiErrorMessage(error, "Unable to export assessment PDF."),
      });
    } catch {
      return;
    }
  }

  if (assessmentsQuery.isLoading || previewQuery.isLoading) {
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Finalization overview</p>
            <h3 className="mt-1 text-xl font-semibold">Department assessment readiness</h3>
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
              disabled={bulkFinalizeMutation.isPending || Boolean(preview?.incompleteCount)}
            >
              {bulkFinalizeMutation.isPending ? "Finalizing..." : "Finalize ready assessments"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportPdf}
              disabled={exportPdfMutation.isPending}
            >
              {exportPdfMutation.isPending ? "Exporting..." : "Export PDF"}
            </Button>
            {preview?.incompleteCount ? (
              <p className="text-sm text-muted">
                Some assessments still need attention before you can finalize them together.
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

        {!assessments.length ? (
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
                  href={`/admin/students/${encodeURIComponent(assessment.matricNumber)}`}
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
