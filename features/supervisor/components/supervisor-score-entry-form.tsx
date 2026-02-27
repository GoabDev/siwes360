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

type SupervisorScoreEntryFormProps = {
  matricNumber: string;
};

export function SupervisorScoreEntryForm({
  matricNumber,
}: SupervisorScoreEntryFormProps) {
  const router = useRouter();
  const studentQuery = useSupervisorStudentQuery(matricNumber);
  const submitMutation = useSubmitSupervisorScoreMutation();

  const form = useForm<SupervisorScoreSchemaInput, unknown, SupervisorScoreSchema>({
    resolver: zodResolver(supervisorScoreSchema),
    defaultValues: {
      score: 0,
      note: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(
        submitMutation.mutateAsync({
          matricNumber,
          score: values.score,
          note: values.note,
        }),
        {
          loading: "Submitting supervision score...",
          success: (data) => data.message,
          error: "Unable to submit supervision score.",
        },
      );
      router.push("/supervisor/submissions");
    } catch {
      return;
    }
  });

  if (studentQuery.isLoading) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">Loading student record...</p>
      </SurfaceCard>
    );
  }

  if (!studentQuery.data) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted">No student record was found for this matric number.</p>
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
        <div className="grid gap-3 text-sm text-muted">
          <p>Matric number: <span className="text-foreground">{student.matricNumber}</span></p>
          <p>Department: <span className="text-foreground">{student.department}</span></p>
          <p>Placement company: <span className="text-foreground">{student.placementCompany}</span></p>
          <p>Placement address: <span className="text-foreground">{student.placementAddress}</span></p>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
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
                      value={typeof field.value === "number" ? field.value : ""}
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
            <Button type="submit" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting score..." : "Submit score"}
            </Button>
          </form>
        </Form>
      </SurfaceCard>
    </div>
  );
}
