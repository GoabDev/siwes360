export type AdminAssessmentRecord = {
  assessmentId: string;
  studentId: string;
  fullName: string;
  email: string;
  matricNumber: string;
  documentSubmissionId: string | null;
  documentValidationScore: number | null;
  reportScore: number | null;
  supervisorScore: number | null;
  logbookScore: number | null;
  presentationScore: number | null;
  totalScore: number;
  isComplete: boolean;
  isFinalized: boolean;
  grade: string | null;
  createdAt: string | null;
};

export type AdminAssessmentsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  isFinalized?: boolean | null;
  departmentId?: string | null;
};

export type PaginatedAdminAssessments = {
  items: AdminAssessmentRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminFinalizePreviewItem = {
  assessmentId: string;
  studentId: string;
  fullName: string;
  email: string;
  matricNumber: string;
  status: "Ready" | "Incomplete" | "AlreadyFinalized";
  missingItems: string[];
  totalScore: number;
  grade: string | null;
  isFinalized: boolean;
};

export type AdminFinalizePreview = {
  readyCount: number;
  incompleteCount: number;
  alreadyFinalizedCount: number;
  items: AdminFinalizePreviewItem[];
};

export type BulkFinalizeResult = {
  finalizedCount: number;
  skippedIncompleteCount: number;
  skippedAlreadyFinalizedCount: number;
  finalizedAssessmentIds: string[];
};

export type AssessmentAuditLogRecord = {
  id: string;
  action: string;
  actorUserId: string | null;
  actorRole: string | null;
  reason: string | null;
  details: string | null;
  reportScore: number | null;
  supervisorScore: number | null;
  logbookScore: number | null;
  presentationScore: number | null;
  totalScore: number;
  grade: string | null;
  isFinalized: boolean;
  createdAt: string;
};

export type AssessmentPdfExport = {
  blob: Blob;
  fileName: string;
  contentType: string;
};

export type AssessmentCsvExport = {
  blob: Blob;
  fileName: string;
  contentType: string;
};
