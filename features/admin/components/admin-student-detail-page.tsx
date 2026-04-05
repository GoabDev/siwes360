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

type AdminStudentDetailPageViewProps = {
  matricNumber: string;
};

export function AdminStudentDetailPageView({
  matricNumber,
}: AdminStudentDetailPageViewProps) {
  const decodedMatricNumber = decodeURIComponent(matricNumber);
  const studentQuery = useAdminStudentQuery(decodedMatricNumber);
  const auditLogQuery = useAssessmentAuditLogQuery(studentQuery.data?.assessmentId);
  const finalizeMutation = useFinalizeAssessmentMutation();
  const unfinalizeMutation = useUnfinalizeAssessmentMutation();
  const [unfinalizeReason, setUnfinalizeReason] = useState("");

  if (studentQuery.isLoading) {
    return (
      <section className="space-y-6">
        <DashboardHero
          eyebrow="Student record"
          title="Loading student information"
          description="Preparing the student profile and grading workspace."
        />
        <SurfaceCard>
          <p className="text-sm text-muted">Loading student record...</p>
        </SurfaceCard>
      </section>
    );
  }

  if (!studentQuery.data) {
    return (
      <section className="space-y-6">
        <DashboardHero
          eyebrow="Student record"
          title="Student not found"
          description="The selected student record is not available in the current directory response."
        />
        <SurfaceCard className="space-y-4">
          <p className="text-sm text-muted">
            No student record was found for matric number {decodedMatricNumber}.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/students">Back to students</Link>
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
        eyebrow="Student record"
        title={student.fullName}
        description="This page is now the single place to inspect a student and later fetch detailed report status, workflow, and grading data."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Student information</p>
            <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
          </div>
          <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
            <p>
              Matric number: <span className="text-foreground">{student.matricNumber || "N/A"}</span>
            </p>
            <p>
              Department: <span className="text-foreground">{student.department}</span>
            </p>
            <p>
              Email: <span className="text-foreground">{student.email || "N/A"}</span>
            </p>
            <p>
              Student ID: <span className="text-foreground">{student.studentId ?? "N/A"}</span>
            </p>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Assessment summary</p>
            <h3 className="mt-1 text-xl font-semibold">
              {student.assessmentId ? "Assessment record found" : "No assessment record yet"}
            </h3>
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
            {student.assessmentId ? (
              <span className="text-xs text-muted">Assessment ID: {student.assessmentId}</span>
            ) : null}
          </div>
          <div className="grid gap-3 text-sm text-muted">
            <p>
              Validation score: <span className="text-foreground">{student.documentValidationScore ?? "Pending"}{student.documentValidationScore !== null ? " / 100" : ""}</span>
            </p>
            <p>
              Report score: <span className="text-foreground">{student.reportScore ?? "Pending"} / 30</span>
            </p>
            <p>
              Supervisor score: <span className="text-foreground">{student.supervisorScore ?? "Pending"} / 10</span>
            </p>
            <p>
              Logbook score: <span className="text-foreground">{student.logbookScore ?? "Pending"} / 30</span>
            </p>
            <p>
              Presentation score: <span className="text-foreground">{student.presentationScore ?? "Pending"} / 30</span>
            </p>
            <p>
              Total: <span className="text-foreground">{student.totalScore ?? "Incomplete"}{student.totalScore !== null ? " / 100" : ""}</span>
            </p>
            <p>
              Grade: <span className="text-foreground">{student.grade ?? "Pending"}</span>
            </p>
            <p>
              Document submission: <span className="text-foreground">{student.documentSubmissionId ?? "Not linked"}</span>
            </p>
            <p>
              Assessment created: <span className="text-foreground">{student.createdAt ? new Date(student.createdAt).toLocaleString() : "N/A"}</span>
            </p>
            <p>
              Finalized at: <span className="text-foreground">{student.finalizedAt ? new Date(student.finalizedAt).toLocaleString() : "Not finalized"}</span>
            </p>
          </div>
          <div className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted md:grid-cols-2">
            <p>
              Supervisor: <span className="text-foreground">{student.supervisorFullName ?? "Pending"}</span>
            </p>
            <p>
              Supervisor scored at: <span className="text-foreground">{student.supervisorScoredAt ? new Date(student.supervisorScoredAt).toLocaleString() : "Pending"}</span>
            </p>
            <p>
              Administrator: <span className="text-foreground">{student.adminFullName ?? "Pending"}</span>
            </p>
            <p>
              Admin scored at: <span className="text-foreground">{student.adminScoredAt ? new Date(student.adminScoredAt).toLocaleString() : "Pending"}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/students">Back to students</Link>
            </Button>
            {canFinalize ? (
              <Button
                type="button"
                onClick={handleFinalize}
                disabled={finalizeMutation.isPending}
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
          </div>
          <p className="text-sm text-muted">
            The backend requires a reason before a finalized assessment can be reopened.
          </p>
          <Textarea
            value={unfinalizeReason}
            onChange={(event) => setUnfinalizeReason(event.target.value)}
            placeholder="State why this finalized assessment should be reopened."
          />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleUnfinalize}
              disabled={unfinalizeMutation.isPending || !unfinalizeReason.trim()}
            >
              {unfinalizeMutation.isPending ? "Reopening..." : "Unfinalize assessment"}
            </Button>
          </div>
        </SurfaceCard>
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Scoring</p>
          <h3 className="mt-1 text-xl font-semibold">Capture admin scores on this page</h3>
        </div>
        <AdminScoreEntryForm matricNumber={student.matricNumber} />
      </section>

      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Audit log</p>
          <h3 className="mt-1 text-xl font-semibold">Assessment activity history</h3>
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
                <div className="flex flex-wrap items-center justify-between gap-3">
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
