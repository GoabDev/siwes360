"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminScoreEntryForm } from "@/features/admin/components/admin-score-entry-form";
import { DashboardHero } from "@/components/ui/dashboard-hero";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Textarea } from "@/components/ui/textarea";
import { useAssessmentAuditLogQuery } from "@/features/admin/queries/admin-assessment-queries";
import {
  useFinalizeAssessmentMutation,
  useAdminStudentQuery,
  useUnfinalizeAssessmentMutation,
} from "@/features/admin/queries/admin-student-queries";
import { getApiErrorMessage } from "@/lib/api/error";
import { toast } from "sonner";
import type { AdminWorkspaceScope } from "@/features/admin/types/admin-scope";

type AdminStudentDetailPageViewProps = {
  matricNumber: string;
  basePath?: string;
  scope?: AdminWorkspaceScope;
};

export function AdminStudentDetailPageView({
  matricNumber,
  basePath = "/admin",
  scope = "department",
}: AdminStudentDetailPageViewProps) {
  const decodedMatricNumber = decodeURIComponent(matricNumber);
  const studentQuery = useAdminStudentQuery(decodedMatricNumber, { scope });
  const auditLogQuery = useAssessmentAuditLogQuery(studentQuery.data?.assessmentId);
  const finalizeMutation = useFinalizeAssessmentMutation();
  const unfinalizeMutation = useUnfinalizeAssessmentMutation();
  const [unfinalizeReason, setUnfinalizeReason] = useState("");

  if (studentQuery.isLoading) {
    return (
      <section className="space-y-6">
        <DashboardHero
          eyebrow="Student details"
          title="Loading student information"
          description="Please wait while the student's information is loaded."
        />
        <SurfaceCard>
          <p className="text-sm text-muted">Loading student details...</p>
        </SurfaceCard>
      </section>
    );
  }

  if (!studentQuery.data) {
    return (
      <section className="space-y-6">
        <DashboardHero
          eyebrow="Student details"
          title="Student not found"
          description={
            scope === "global"
              ? "We could not find this student in the global records."
              : "We could not find this student in your department list."
          }
        />
        <SurfaceCard className="space-y-4">
          <p className="text-sm text-muted">
            No student was found for matric number {decodedMatricNumber}.
          </p>
          <Button asChild variant="outline">
            <Link href={`${basePath}/students`}>Back to students</Link>
          </Button>
        </SurfaceCard>
      </section>
    );
  }

  const student = studentQuery.data;
  const canFinalize = Boolean(student.assessmentId) && !student.isFinalized;
  const canUnfinalize = Boolean(student.assessmentId) && student.isFinalized;

  async function handleFinalize() {
    if (!student.assessmentId) {
      return;
    }

    try {
      await toast.promise(finalizeMutation.mutateAsync(student.assessmentId), {
        loading: "Finalizing assessment...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to finalize assessment."),
      });
    } catch {
      return;
    }
  }

  async function handleUnfinalize() {
    if (!student.assessmentId || !unfinalizeReason.trim()) {
      return;
    }

    try {
      await toast.promise(
        unfinalizeMutation.mutateAsync({
          assessmentId: student.assessmentId,
          reason: unfinalizeReason.trim(),
        }),
        {
          loading: "Unfinalizing assessment...",
          success: (data) => data.message,
          error: (error) => getApiErrorMessage(error, "Unable to unfinalize assessment."),
        },
      );
      setUnfinalizeReason("");
    } catch {
      return;
    }
  }

  return (
    <section className="space-y-6">
      <DashboardHero
        eyebrow="Student details"
        title={student.fullName}
        description="Review this student's information, progress, and scores in one place."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Student information</p>
            <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Keep these details in view while reviewing the student&apos;s assessment.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Matric number", student.matricNumber || "N/A"],
              ["Department", student.department],
              ["Email", student.email || "N/A"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Assessment summary</p>
            <h3 className="mt-1 text-xl font-semibold">
              {student.assessmentId ? "Assessment available" : "Assessment not available yet"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Check the current result, finalization state, and the scoring trail from one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              label={student.status}
              variant={
                student.status === "complete"
                  ? "success"
                  : student.status === "ready"
                    ? "warning"
                    : "pending"
              }
            />
            {student.isFinalized ? (
              <StatusBadge label="Finalized" variant="success" />
            ) : (
              <StatusBadge label="Editable" variant="neutral" />
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Validation score", `${student.documentValidationScore ?? "Pending"}${student.documentValidationScore !== null ? " / 100" : ""}`],
              ["Report score", `${student.reportScore ?? "Pending"} / 30`],
              ["Supervisor score", `${student.supervisorScore ?? "Pending"} / 10`],
              ["Logbook score", `${student.logbookScore ?? "Pending"} / 30`],
              ["Presentation score", `${student.presentationScore ?? "Pending"} / 30`],
              ["Total", `${student.totalScore ?? "Incomplete"}${student.totalScore !== null ? " / 100" : ""}`],
              ["Grade", student.grade ?? "Pending"],
              ["Assessment created", student.createdAt ? new Date(student.createdAt).toLocaleString() : "N/A"],
              ["Finalized at", student.finalizedAt ? new Date(student.finalizedAt).toLocaleString() : "Not finalized"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Scoring activity</p>
              <p className="mt-2 leading-6 text-muted">
                See who has already scored this assessment and when the scores were submitted.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Supervisor</p>
                <p className="mt-1 text-foreground">{student.supervisorFullName ?? "Pending"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Supervisor scored at</p>
                <p className="mt-1 text-foreground">
                  {student.supervisorScoredAt ? new Date(student.supervisorScoredAt).toLocaleString() : "Pending"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Administrator</p>
                <p className="mt-1 text-foreground">{student.adminFullName ?? "Pending"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Admin scored at</p>
                <p className="mt-1 text-foreground">
                  {student.adminScoredAt ? new Date(student.adminScoredAt).toLocaleString() : "Pending"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`${basePath}/students`}>Back to students</Link>
            </Button>
            {canFinalize ? (
              <Button
                type="button"
                onClick={handleFinalize}
                disabled={finalizeMutation.isPending}
                className="w-full sm:w-auto"
              >
                {finalizeMutation.isPending ? "Finalizing..." : "Finalize assessment"}
              </Button>
            ) : null}
          </div>
        </SurfaceCard>
      </div>

      {canUnfinalize ? (
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Unfinalize</p>
            <h3 className="mt-1 text-xl font-semibold">Reopen this assessment</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use this only when the assessment needs a correction or another review pass.
            </p>
          </div>
          <Textarea
            value={unfinalizeReason}
            onChange={(event) => setUnfinalizeReason(event.target.value)}
            placeholder="Explain why you want to reopen this assessment."
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={handleUnfinalize}
              disabled={unfinalizeMutation.isPending || !unfinalizeReason.trim()}
              className="w-full sm:w-auto"
            >
              {unfinalizeMutation.isPending ? "Reopening..." : "Unfinalize assessment"}
            </Button>
          </div>
        </SurfaceCard>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Scoring</p>
          <h3 className="mt-1 text-xl font-semibold">Enter admin scores here</h3>
        </div>
        <AdminScoreEntryForm matricNumber={student.matricNumber} scope={scope} />
      </section>

      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Audit log</p>
          <h3 className="mt-1 text-xl font-semibold">Activity history</h3>
        </div>
        {auditLogQuery.isLoading ? (
          <div className="rounded-[1.35rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
            Loading audit history...
          </div>
        ) : !auditLogQuery.data?.length ? (
          <div className="rounded-[1.35rem] border border-dashed border-border bg-background/60 p-4 text-sm text-muted">
            No audit entries have been recorded for this assessment yet.
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogQuery.data.map((entry) => (
              <article
                key={entry.id}
                className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{entry.action}</p>
                    <p className="text-xs text-muted">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {entry.actorRole ? (
                      <StatusBadge label={entry.actorRole} variant="neutral" />
                    ) : null}
                    {entry.isFinalized ? (
                      <StatusBadge label="Finalized snapshot" variant="success" />
                    ) : (
                      <StatusBadge label="Open snapshot" variant="pending" />
                    )}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted md:grid-cols-2">
                  <p>
                    Report: <span className="text-foreground">{entry.reportScore ?? "Pending"}</span>
                  </p>
                  <p>
                    Supervisor: <span className="text-foreground">{entry.supervisorScore ?? "Pending"}</span>
                  </p>
                  <p>
                    Logbook: <span className="text-foreground">{entry.logbookScore ?? "Pending"}</span>
                  </p>
                  <p>
                    Presentation: <span className="text-foreground">{entry.presentationScore ?? "Pending"}</span>
                  </p>
                  <p>
                    Total: <span className="text-foreground">{entry.totalScore}</span>
                  </p>
                  <p>
                    Grade: <span className="text-foreground">{entry.grade ?? "Pending"}</span>
                  </p>
                </div>
                {entry.details ? (
                  <p className="mt-3 text-sm text-muted">
                    Details: <span className="text-foreground">{entry.details}</span>
                  </p>
                ) : null}
                {entry.reason ? (
                  <p className="mt-2 text-sm text-muted">
                    Reason: <span className="text-foreground">{entry.reason}</span>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </SurfaceCard>
    </section>
  );
}
