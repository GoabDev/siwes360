"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type {
  AdminAssessmentRecord,
  AdminAssessmentsQueryParams,
  AdminFinalizePreview,
  AssessmentAuditLogRecord,
  AssessmentCsvExport,
  AssessmentPdfExport,
  BulkFinalizeResult,
  PaginatedAdminAssessments,
} from "@/features/admin/types/admin-assessments";

type Envelope<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

type AssessmentSummaryDto = {
  id: string;
  studentId: string;
  studentFullName: string;
  studentEmail: string;
  matricNumber: string;
  documentSubmissionId?: string | null;
  documentValidationScore?: number | null;
  reportScore?: number | null;
  supervisorScore?: number | null;
  logbookScore?: number | null;
  presentationScore?: number | null;
  totalScore: number;
  isComplete: boolean;
  isFinalized: boolean;
  grade?: string | null;
  createdAt: string;
};

type PagedAssessmentDto = {
  items?: AssessmentSummaryDto[];
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
} | null;

type FinalizePreviewItemDto = {
  assessmentId: string;
  studentId: string;
  studentFullName: string;
  studentEmail: string;
  matricNumber: string;
  status: "Ready" | "Incomplete" | "AlreadyFinalized";
  missingItems?: string[];
  totalScore: number;
  grade?: string | null;
  isFinalized: boolean;
};

type FinalizePreviewDto = {
  readyCount: number;
  incompleteCount: number;
  alreadyFinalizedCount: number;
  items: FinalizePreviewItemDto[];
};

type BulkFinalizeResultDto = {
  finalizedCount: number;
  skippedIncompleteCount: number;
  skippedAlreadyFinalizedCount: number;
  finalizedAssessmentIds: string[];
};

type AssessmentAuditLogDto = {
  id: string;
  action: string;
  actorUserId?: string | null;
  actorRole?: string | null;
  reason?: string | null;
  details?: string | null;
  reportScore?: number | null;
  supervisorScore?: number | null;
  logbookScore?: number | null;
  presentationScore?: number | null;
  totalScore: number;
  grade?: string | null;
  isFinalized: boolean;
  createdAt: string;
};

function mapAssessmentSummary(dto: AssessmentSummaryDto): AdminAssessmentRecord {
  return {
    assessmentId: dto.id,
    studentId: dto.studentId,
    fullName: dto.studentFullName,
    email: dto.studentEmail,
    matricNumber: dto.matricNumber,
    documentSubmissionId: dto.documentSubmissionId ?? null,
    documentValidationScore: dto.documentValidationScore ?? null,
    reportScore: dto.reportScore ?? null,
    supervisorScore: dto.supervisorScore ?? null,
    logbookScore: dto.logbookScore ?? null,
    presentationScore: dto.presentationScore ?? null,
    totalScore: dto.totalScore,
    isComplete: dto.isComplete,
    isFinalized: dto.isFinalized,
    grade: dto.grade ?? null,
    createdAt: dto.createdAt ?? null,
  };
}

export async function getAdminAssessments(
  params: AdminAssessmentsQueryParams = {},
): Promise<PaginatedAdminAssessments> {
  const normalizedParams = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 10,
    searchTerm: params.searchTerm?.trim() ?? "",
    isFinalized: params.isFinalized ?? null,
    departmentId: params.departmentId ?? null,
  };

  const response = await apiClient.get<Envelope<PagedAssessmentDto>>(apiEndpoints.assessment.admin, {
    params: {
      pageNumber: normalizedParams.pageNumber,
      pageSize: normalizedParams.pageSize,
      searchTerm: normalizedParams.searchTerm,
      isFinalized: normalizedParams.isFinalized,
      departmentId: normalizedParams.departmentId ?? undefined,
    },
  });

  const payload = response.data?.data;
  const items = (payload?.items ?? []).map(mapAssessmentSummary);

  return {
    items,
    pageNumber: payload?.pageNumber ?? normalizedParams.pageNumber,
    pageSize: payload?.pageSize ?? normalizedParams.pageSize,
    totalCount: payload?.totalCount ?? items.length,
    totalPages: payload?.totalPages ?? Math.max(1, Math.ceil((payload?.totalCount ?? items.length) / normalizedParams.pageSize)),
  };
}

export async function getAdminFinalizePreview(
  searchTerm = "",
  departmentId?: string | null,
): Promise<AdminFinalizePreview> {
  const response = await apiClient.get<Envelope<FinalizePreviewDto>>(apiEndpoints.assessment.finalizePreview, {
    params: {
      searchTerm: searchTerm.trim() || undefined,
      departmentId: departmentId ?? undefined,
    },
  });

  const payload = response.data?.data;

  return {
    readyCount: payload?.readyCount ?? 0,
    incompleteCount: payload?.incompleteCount ?? 0,
    alreadyFinalizedCount: payload?.alreadyFinalizedCount ?? 0,
    items: (payload?.items ?? []).map((item) => ({
      assessmentId: item.assessmentId,
      studentId: item.studentId,
      fullName: item.studentFullName,
      email: item.studentEmail,
      matricNumber: item.matricNumber,
      status: item.status,
      missingItems: item.missingItems ?? [],
      totalScore: item.totalScore,
      grade: item.grade ?? null,
      isFinalized: item.isFinalized,
    })),
  };
}

export async function bulkFinalizeAssessments(
  departmentId?: string | null,
): Promise<BulkFinalizeResult> {
  const response = await apiClient.post<Envelope<BulkFinalizeResultDto>>(
    apiEndpoints.assessment.finalizeAll,
    {
      departmentId: departmentId ?? undefined,
    },
  );
  const payload = response.data?.data;

  return {
    finalizedCount: payload?.finalizedCount ?? 0,
    skippedIncompleteCount: payload?.skippedIncompleteCount ?? 0,
    skippedAlreadyFinalizedCount: payload?.skippedAlreadyFinalizedCount ?? 0,
    finalizedAssessmentIds: payload?.finalizedAssessmentIds ?? [],
  };
}

export async function getAssessmentAuditLog(assessmentId: string): Promise<AssessmentAuditLogRecord[]> {
  const response = await apiClient.get<Envelope<AssessmentAuditLogDto[]>>(
    apiEndpoints.assessment.auditLog(assessmentId),
  );

  return (response.data?.data ?? []).map((item) => ({
    id: item.id,
    action: item.action,
    actorUserId: item.actorUserId ?? null,
    actorRole: item.actorRole ?? null,
    reason: item.reason ?? null,
    details: item.details ?? null,
    reportScore: item.reportScore ?? null,
    supervisorScore: item.supervisorScore ?? null,
    logbookScore: item.logbookScore ?? null,
    presentationScore: item.presentationScore ?? null,
    totalScore: item.totalScore,
    grade: item.grade ?? null,
    isFinalized: item.isFinalized,
    createdAt: item.createdAt,
  }));
}

function getExportFileName(contentDisposition: unknown, fallbackFileName: string) {
  const fileNameMatch = typeof contentDisposition === "string"
    ? /filename="?([^"]+)"?/i.exec(contentDisposition)
    : null;

  return fileNameMatch?.[1] ?? fallbackFileName;
}

export async function exportDepartmentAssessmentPdf(
  departmentId?: string | null,
): Promise<AssessmentPdfExport> {
  const response = await apiClient.get<Blob>(apiEndpoints.assessment.exportPdf, {
    params: {
      departmentId: departmentId ?? undefined,
    },
    responseType: "blob",
  });

  return {
    blob: response.data,
    fileName: getExportFileName(response.headers["content-disposition"], "siwes-assessments.pdf"),
    contentType: response.headers["content-type"] ?? "application/pdf",
  };
}

export async function exportDepartmentAssessmentCsv(
  departmentId?: string | null,
): Promise<AssessmentCsvExport> {
  const response = await apiClient.get<Blob>(apiEndpoints.assessment.exportCsv, {
    params: {
      departmentId: departmentId ?? undefined,
    },
    responseType: "blob",
  });

  return {
    blob: response.data,
    fileName: getExportFileName(response.headers["content-disposition"], "siwes-assessments.csv"),
    contentType: response.headers["content-type"] ?? "text/csv; charset=utf-8",
  };
}
