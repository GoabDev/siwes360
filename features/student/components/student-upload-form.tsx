"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FileText, UploadCloud } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import { StudentReportStatusCard } from "@/features/student/components/student-report-status-card";
import {
  studentReportSchema,
  type StudentReportSchema,
} from "@/features/student/schemas/student-report-schema";
import {
  useStoredStudentSubmissionIdQuery,
  useStudentDocumentStatusQuery,
  useStudentValidationReportQuery,
  useUploadStudentDocumentMutation,
} from "@/features/student/queries/student-report-queries";
import { getApiErrorMessage } from "@/lib/api/error";

const defaultValues = {
  file: undefined as unknown as File,
};

export function StudentUploadForm() {
  const submissionIdQuery = useStoredStudentSubmissionIdQuery();
  const statusQuery = useStudentDocumentStatusQuery(submissionIdQuery.data);
  const validationReportQuery = useStudentValidationReportQuery(submissionIdQuery.data);
  const uploadMutation = useUploadStudentDocumentMutation();
  const isStatusLoading =
    submissionIdQuery.isLoading || statusQuery.isLoading || validationReportQuery.isLoading;

  const form = useForm<StudentReportSchema>({
    resolver: zodResolver(studentReportSchema),
    defaultValues,
  });
  const selectedFile = useWatch({
    control: form.control,
    name: "file",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(uploadMutation.mutateAsync(values), {
        loading: "Uploading SIWES report...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to upload report."),
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
          Upload your SIWES report
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
          Upload your report in DOCX format and we will begin checking it automatically.
        </p>
      </div>

      {selectedFile ? (
        <div className="rounded-[1.35rem] border border-brand/20 bg-brand/8 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-brand/12 p-2 text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                  Selected file
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{selectedFile.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {Math.max(1, Math.ceil(selectedFile.size / 1024))} KB
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">
              This file will be uploaded and then tracked automatically on this page.
            </p>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
              Current submission
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              {isStatusLoading
                ? "Loading your current submission"
                : statusQuery.data
                  ? "Track your latest upload immediately"
                  : "No active submission yet"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {isStatusLoading
                ? "Checking your latest report status."
                : statusQuery.data
                ? "You can follow the progress of your latest report from this page."
                : "After upload, the latest document status will appear here without leaving the page."}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/student/report-status">Open full status page</Link>
          </Button>
        </div>

        {submissionIdQuery.error || statusQuery.error || validationReportQuery.error ? (
          <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {getApiErrorMessage(
              submissionIdQuery.error ?? statusQuery.error ?? validationReportQuery.error,
              "Unable to load your current report status.",
            )}
          </div>
        ) : null}

        <StudentReportStatusCard
          status={statusQuery.data ?? null}
          report={validationReportQuery.data ?? null}
          isLoading={isStatusLoading && !(submissionIdQuery.error || statusQuery.error || validationReportQuery.error)}
        />
      </div>

      <SurfaceCard>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <SectionHeading
              eyebrow="Submission"
              title="Choose your report file"
              description="Once you upload your report, you can track its progress here."
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
                          Choose a DOCX file
                        </span>
                        <span className="mt-2 text-sm text-muted">
                          Maximum size: 10MB
                        </span>
                        {selectedFile ? (
                          <span className="mt-3 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                            {selectedFile.name}
                          </span>
                        ) : null}
                        <input
                          ref={ref}
                          name={name}
                          type="file"
                          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            onChange(file);
                          }}
                        />
                      </label>
                    </FormControl>
                    <FormDescription>
                      Please upload a Word document in DOCX format.
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
            <p className="text-sm leading-6 text-muted">
              After upload, your latest review updates and formatting checks will appear above.
            </p>
          </form>
        </Form>
      </SurfaceCard>
    </section>
  );
}
