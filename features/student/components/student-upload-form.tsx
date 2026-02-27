"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
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
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Textarea } from "@/components/ui/textarea";
import { StudentReportStatusCard } from "@/features/student/components/student-report-status-card";
import {
  studentReportSchema,
  type StudentReportSchema,
} from "@/features/student/schemas/student-report-schema";
import {
  useStudentReportQuery,
  useUploadStudentReportMutation,
} from "@/features/student/queries/student-report-queries";

const defaultValues = {
  title: "",
  summary: "",
  file: undefined as unknown as File,
};

export function StudentUploadForm() {
  const reportQuery = useStudentReportQuery();
  const uploadMutation = useUploadStudentReportMutation();

  const form = useForm<StudentReportSchema>({
    resolver: zodResolver(studentReportSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(uploadMutation.mutateAsync(values), {
        loading: "Uploading SIWES report...",
        success: (data) => data.message,
        error: "Unable to upload report.",
      });
      form.reset(defaultValues);
    } catch {
      return;
    }
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/80 bg-[linear-gradient(135deg,_rgba(31,107,79,0.12),_rgba(215,155,44,0.12))] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">Report upload</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Submit your SIWES report into the review pipeline
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          This flow is structured for file upload, review status tracking, and later backend validation responses.
        </p>
      </div>

      <StudentReportStatusCard report={reportQuery.data ?? null} />

      <SurfaceCard>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <SectionHeading
              eyebrow="Submission"
              title="Upload package"
              description="Submit a file and short context note so the review pipeline has enough metadata to work with."
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the report title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submission summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the report content or placement focus."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This summary can later help admins and supervisors identify the submission quickly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => {
                const { onChange, name, ref } = field;

                return (
                  <FormItem>
                    <FormLabel>Report file</FormLabel>
                    <FormControl>
                      <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-border bg-background/60 px-6 py-7 text-center">
                        <UploadCloud className="h-8 w-8 text-brand" />
                        <span className="mt-4 text-base font-medium">
                          Choose a PDF or DOCX file
                        </span>
                        <span className="mt-2 text-sm text-muted">
                          Maximum size: 10MB
                        </span>
                        <input
                          ref={ref}
                          name={name}
                          type="file"
                          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            onChange(file);
                          }}
                        />
                      </label>
                    </FormControl>
                    <FormDescription>
                      Backend checks will later handle formatting, plagiarism, and AI review.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading report..." : "Upload report"}
            </Button>
          </form>
        </Form>
      </SurfaceCard>
    </section>
  );
}
