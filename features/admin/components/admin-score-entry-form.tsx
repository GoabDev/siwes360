"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

type AdminScoreEntryFormProps = {
  matricNumber: string;
};

export function AdminScoreEntryForm({ matricNumber }: AdminScoreEntryFormProps) {
  const router = useRouter();
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

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(
        submitMutation.mutateAsync({
          matricNumber,
          logbookScore: values.logbookScore,
          presentationScore: values.presentationScore,
          note: values.note,
        }),
        {
          loading: "Saving admin scores...",
          success: (data) => data.message,
          error: "Unable to save admin scores.",
        },
      );
      router.push("/admin/students");
    } catch {
      return;
    }
  });

  if (studentQuery.isLoading) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">Loading student grading record...</p>
      </SurfaceCard>
    );
  }

  if (!studentQuery.data) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">No student grading record was found for this matric number.</p>
      </SurfaceCard>
    );
  }

  const student = studentQuery.data;

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
          {(student.logbookScore !== null || student.presentationScore !== null) ? (
            <StatusBadge label="Editable draft" variant="neutral" />
          ) : null}
        </div>
        <div className="grid gap-3 text-sm text-muted">
          <p>Matric number: <span className="text-foreground">{student.matricNumber}</span></p>
          <p>Department: <span className="text-foreground">{student.department}</span></p>
          <p>Report score: <span className="text-foreground">{student.reportScore ?? "Pending"} / 30</span></p>
          <p>Supervisor score: <span className="text-foreground">{student.supervisorScore ?? "Pending"} / 10</span></p>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            {(student.logbookScore !== null || student.presentationScore !== null) ? (
              <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted">
                Existing admin scores can be updated here during development. Backend permissions can later restrict this to explicit edit rules.
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
                      value={typeof field.value === "number" ? field.value : ""}
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
                      value={typeof field.value === "number" ? field.value : ""}
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
                    <Textarea placeholder="Short note about the grading context." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Saving scores..." : "Save scores"}
            </Button>
          </form>
        </Form>
      </SurfaceCard>
    </div>
  );
}
