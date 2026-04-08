"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentStudentSubmissionId,
  getStudentDocumentStatus,
  getStudentValidationReport,
  uploadStudentDocument,
} from "@/features/student/services/student-report-service";
import type {
  StudentDocumentStatus,
  StudentValidationReport,
} from "@/features/student/types/student-report";

export const studentDocumentSubmissionKey = ["student-document-submission"];
export const studentDocumentStatusKey = (submissionId: string) => ["student-document-status", submissionId];
export const studentValidationReportKey = (submissionId: string) => [
  "student-validation-report",
  submissionId,
];

export function useStoredStudentSubmissionIdQuery() {
  return useQuery({
    queryKey: studentDocumentSubmissionKey,
    queryFn: getCurrentStudentSubmissionId,
  });
}

export function useStudentDocumentStatusQuery(submissionId: string | null | undefined) {
  return useQuery({
    queryKey: studentDocumentStatusKey(submissionId ?? ""),
    queryFn: () => getStudentDocumentStatus(submissionId ?? ""),
    enabled: Boolean(submissionId),
    refetchInterval: (query) => {
      const status = query.state.data?.currentStatus;
      return status === "Queued" || status === "Validating" || status === "Uploaded" || status === "Processing"
        ? 4_000
        : false;
    },
  });
}

export function useStudentValidationReportQuery(
  submissionId: string | null | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: studentValidationReportKey(submissionId ?? ""),
    queryFn: () => getStudentValidationReport(submissionId ?? ""),
    enabled: Boolean(submissionId) && enabled,
    refetchInterval: (query) => {
      const report = query.state.data;
      return report && report.validatedAt == null ? 4_000 : false;
    },
  });
}

export function useUploadStudentDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadStudentDocument,
    onSuccess: (data) => {
      queryClient.setQueryData<string | null>(studentDocumentSubmissionKey, data.submissionId);
      queryClient.removeQueries({ queryKey: ["student-document-status"] });
      queryClient.removeQueries({ queryKey: ["student-validation-report"] });
      queryClient.invalidateQueries({ queryKey: ["student-workflow"] });
      queryClient.setQueryData<StudentDocumentStatus | null>(
        studentDocumentStatusKey(data.submissionId),
        null,
      );
      queryClient.setQueryData<StudentValidationReport | null>(
        studentValidationReportKey(data.submissionId),
        null,
      );
    },
  });
}
