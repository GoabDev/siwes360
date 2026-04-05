"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkFinalizeAssessments,
  exportDepartmentAssessmentPdf,
  getAssessmentAuditLog,
  getAdminAssessments,
  getAdminFinalizePreview,
} from "@/features/admin/services/admin-assessment-service";
import type { AdminAssessmentsQueryParams } from "@/features/admin/types/admin-assessments";

export const adminAssessmentsKey = (params?: AdminAssessmentsQueryParams) => ["admin-assessments", params];
export const adminFinalizePreviewKey = (searchTerm?: string) => ["admin-finalize-preview", searchTerm ?? ""];
export const adminAssessmentAuditLogKey = (assessmentId: string) => ["admin-assessment-audit-log", assessmentId];

export function useAdminAssessmentsQuery(params?: AdminAssessmentsQueryParams) {
  return useQuery({
    queryKey: adminAssessmentsKey(params),
    queryFn: () => getAdminAssessments(params),
  });
}

export function useAdminFinalizePreviewQuery(searchTerm?: string) {
  return useQuery({
    queryKey: adminFinalizePreviewKey(searchTerm),
    queryFn: () => getAdminFinalizePreview(searchTerm),
  });
}

export function useBulkFinalizeAssessmentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkFinalizeAssessments,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-finalize-preview"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-student"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-students"] });
    },
  });
}

export function useAssessmentAuditLogQuery(assessmentId: string | null | undefined) {
  return useQuery({
    queryKey: adminAssessmentAuditLogKey(assessmentId ?? ""),
    queryFn: () => getAssessmentAuditLog(assessmentId ?? ""),
    enabled: Boolean(assessmentId),
  });
}

export function useExportDepartmentAssessmentPdfMutation() {
  return useMutation({
    mutationFn: exportDepartmentAssessmentPdf,
  });
}
