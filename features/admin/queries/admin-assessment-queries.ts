"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkFinalizeAssessments,
  exportDepartmentAssessmentCsv,
  exportDepartmentAssessmentPdf,
  getAssessmentAuditLog,
  getAdminAssessments,
  getAdminFinalizePreview,
} from "@/features/admin/services/admin-assessment-service";
import type { AdminAssessmentsQueryParams } from "@/features/admin/types/admin-assessments";

export const adminAssessmentsKey = (params?: AdminAssessmentsQueryParams) => ["admin-assessments", params];
export const adminFinalizePreviewKey = (searchTerm?: string, departmentId?: string | null) => [
  "admin-finalize-preview",
  searchTerm ?? "",
  departmentId ?? null,
];
export const adminAssessmentAuditLogKey = (assessmentId: string) => ["admin-assessment-audit-log", assessmentId];

export function useAdminAssessmentsQuery(params?: AdminAssessmentsQueryParams, enabled = true) {
  return useQuery({
    queryKey: adminAssessmentsKey(params),
    queryFn: () => getAdminAssessments(params),
    enabled,
  });
}

export function useAdminFinalizePreviewQuery(
  searchTerm?: string,
  departmentId?: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: adminFinalizePreviewKey(searchTerm, departmentId),
    queryFn: () => getAdminFinalizePreview(searchTerm, departmentId),
    enabled,
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

export function useExportDepartmentAssessmentCsvMutation() {
  return useMutation({
    mutationFn: exportDepartmentAssessmentCsv,
  });
}
