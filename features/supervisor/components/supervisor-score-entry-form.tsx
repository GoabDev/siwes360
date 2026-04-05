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
import {
  supervisorScoreSchema,
  type SupervisorScoreSchema,
  type SupervisorScoreSchemaInput,
} from "@/features/supervisor/schemas/supervisor-score-schema";
import {
  useSubmitSupervisorScoreMutation,
  useSupervisorStudentQuery,
} from "@/features/supervisor/queries/supervisor-student-queries";
import { getApiErrorMessage } from "@/lib/api/error";

type SupervisorScoreEntryFormProps = {
  matricNumber: string;
};

export function SupervisorScoreEntryForm({
  matricNumber,
}: SupervisorScoreEntryFormProps) {
  const studentQuery = useSupervisorStudentQuery(matricNumber);
  const submitMutation = useSubmitSupervisorScoreMutation();

  const form = useForm<SupervisorScoreSchemaInput, unknown, SupervisorScoreSchema>({
    resolver: zodResolver(supervisorScoreSchema),
    defaultValues: {
      score: 0,
      note: "",
    },
  });
  const student = studentQuery.data;

  useEffect(() => {
    if (!student) {
      return;
    }

    form.reset({
      score: student.supervisorScore ?? 0,
      note: "",
    });
  }, [form, student]);

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
          score: values.score,
          note: values.note,
        }),
        {
          loading: "Submitting supervision score...",
          success: (data) => data.message,
          error: (error) => getApiErrorMessage(error, "Unable to submit supervision score."),
        },
      );
    } catch {
      return;
    }
  });

  if (student.isFinalized) {
    return (
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Student summary</p>
            <h3 className="mt-1 text-xl font-semibold">{student.fullName}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Finalized" variant="success" />
            {student.supervisorScore !== null ? (
              <StatusBadge label="Supervisor score recorded" variant="neutral" />
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Matric number", student.matricNumber],
              ["Department", student.department],
              ["Report score", `${student.reportScore ?? "Pending"} / 30`],
              ["Supervisor score", `${student.supervisorScore ?? "Pending"} / 10`],
              ["Total", student.isComplete ? `${student.totalScore} / 100` : "Incomplete"],
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
            This student&apos;s assessment has already been finalized.
          </p>
          <p className="text-sm text-muted">
            You can no longer change the supervision score.
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
            label={student.status === "scored" ? "Scored" : "Pending"}
            variant={student.status === "scored" ? "warning" : "pending"}
          />
          <StatusBadge label="Editable" variant="neutral" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Matric number", student.matricNumber],
            ["Department", student.department],
            ["Email", student.email],
            ["Validation score", `${student.documentValidationScore ?? "Pending"}${student.documentValidationScore !== null ? " / 100" : ""}`],
            ["Report score", `${student.reportScore ?? "Pending"} / 30`],
            ["Total", student.isComplete ? `${student.totalScore} / 100` : "Incomplete"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-sm text-muted">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
              <p className="mt-2 break-words text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">Supervisor scoring</p>
              <h3 className="mt-1 text-xl font-semibold">Enter the supervision score</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Add the student&apos;s score and a short note from your visit or review.
              </p>
            </div>
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervision score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      name={field.name}
                      ref={field.ref}
                      value={field.value == null ? "" : String(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.value)}
                    />
                  </FormControl>
                  <FormDescription>Allowed range is 0 to 10.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief note confirming the visit and evaluation context."
                      
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitMutation.isPending} className="w-full sm:w-auto">
              {submitMutation.isPending ? "Submitting score..." : "Submit score"}
            </Button>
          </form>
        </Form>
      </SurfaceCard>
    </div>
  );
}
