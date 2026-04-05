"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStudentQuery, useSubmitAdminScoresMutation } from "@/features/admin/queries/admin-student-queries";
import {
  adminScoreSchema,
  type AdminScoreSchema,
  type AdminScoreSchemaInput,
} from "@/features/admin/schemas/admin-score-schema";
import { getApiErrorMessage } from "@/lib/api/error";

type AdminScoreEntryFormProps = {
  matricNumber: string;
};

export function AdminScoreEntryForm({ matricNumber }: AdminScoreEntryFormProps) {
  const studentQuery = useAdminStudentQuery(matricNumber);
  const submitMutation = useSubmitAdminScoresMutation();

  const form = useForm<AdminScoreSchemaInput, unknown, AdminScoreSchema>({
    resolver: zodResolver(adminScoreSchema),
    defaultValues: {
      logbookScore: 0,
      presentationScore: 0,
      note: "",
    },
  });

  const student = studentQuery.data;

  useEffect(() => {
    if (!student) {
      return;
    }

    form.reset({
      logbookScore: student.logbookScore ?? 0,
      presentationScore: student.presentationScore ?? 0,
      note: "",
    });
  }, [form, student]);

  const onSubmit = form.handleSubmit(async (values) => {
    const assessmentId = student?.assessmentId;

    if (!assessmentId) {
      return;
    }

    try {
      await toast.promise(
        submitMutation.mutateAsync({
          assessmentId,
          matricNumber,
          logbookScore: values.logbookScore,
          presentationScore: values.presentationScore,
          note: values.note,
        }),
        {
          loading: "Saving admin scores...",
          success: (data) => data.message,
          error: (error) => getApiErrorMessage(error, "Unable to save admin scores."),
        },
      );
    } catch {
      return;
    }
  });

  if (studentQuery.isLoading) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">Loading student details...</p>
      </SurfaceCard>
    );
  }

  if (!student) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">No student was found for this matric number.</p>
      </SurfaceCard>
    );
  }

  if (!student.assessmentId) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-sm text-muted">
          This student is not ready for admin grading yet.
        </p>
        <p className="text-sm text-muted">
          The student needs to submit a report before you can enter scores here.
        </p>
      </SurfaceCard>
    );
  }

  if (student.isFinalized) {
    return (
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Student summary</p>
            <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={student.status} variant="success" />
            <StatusBadge label="Finalized" variant="success" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Matric number", student.matricNumber],
              ["Department", student.department],
              ["Report score", `${student.reportScore ?? "Pending"} / 30`],
              ["Supervisor score", `${student.supervisorScore ?? "Pending"} / 10`],
              ["Logbook score", `${student.logbookScore ?? "Pending"} / 30`],
              ["Presentation score", `${student.presentationScore ?? "Pending"} / 30`],
              ["Grade", student.grade ?? "Pending"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-3">
          <p className="text-sm text-muted">
            This assessment has already been finalized.
          </p>
          <p className="text-sm text-muted">
            The scores are locked and cannot be changed unless the assessment is reopened.
          </p>
          <p className="text-sm text-muted">
            Finalized at: <span className="text-foreground">{student.finalizedAt ? new Date(student.finalizedAt).toLocaleString() : "N/A"}</span>
          </p>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Student summary</p>
          <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
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
          <StatusBadge label="Editable" variant="neutral" />
          {(student.logbookScore !== null || student.presentationScore !== null) ? (
            <StatusBadge label="Editable draft" variant="neutral" />
          ) : null}
        </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Matric number", student.matricNumber],
              ["Department", student.department],
              ["Report score", `${student.reportScore ?? "Pending"} / 30`],
              ["Supervisor score", `${student.supervisorScore ?? "Pending"} / 10`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
                <p className="mt-2 text-foreground">{value}</p>
              </div>
            ))}
          </div>
      </SurfaceCard>

      <SurfaceCard>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Admin scoring</p>
              <h3 className="mt-1 text-xl font-semibold">Enter logbook and presentation scores</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Save the scores here and keep the student on this page while you review the rest of the record.
              </p>
            </div>
            {(student.logbookScore !== null || student.presentationScore !== null) ? (
              <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted">
                Existing scores are shown here so you can review or update them before final submission.
              </div>
            ) : null}
            <FormField
              control={form.control}
              name="logbookScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logbook score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={30}
                      step={1}
                      name={field.name}
                      ref={field.ref}
                      value={field.value == null ? "" : String(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormDescription>Allowed range is 0 to 30.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="presentationScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentation score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={30}
                      step={1}
                      name={field.name}
                      ref={field.ref}
                      value={field.value == null ? "" : String(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormDescription>Allowed range is 0 to 30.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grading note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a short note if needed." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitMutation.isPending} className="w-full sm:w-auto">
              {submitMutation.isPending ? "Saving scores..." : "Save scores"}
            </Button>
          </form>
        </Form>
      </SurfaceCard>
    </div>
  );
}
