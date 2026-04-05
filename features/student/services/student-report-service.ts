"use client";

import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  DocumentValidationStatus,
  StudentDocumentStatus,
  StudentDocumentUploadPayload,
  StudentDocumentUploadResult,
  StudentValidationRuleResult,
  StudentValidationReport,
} from "@/features/student/types/student-report";

const SUBMISSION_ID_STORAGE_KEY = "siwes360-student-document-submission-id";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

type UserProfileApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
  } | null;
};

type AssessmentDto = {
  id: string;
  documentSubmissionId?: string | null;
};

type RawStudentDocumentTimelineEvent = {
  status?: string | number | null;
  occurredAt?: string | null;
  description?: string | null;
};

type RawStudentDocumentStatus = {
  submissionId?: string | null;
  fileName?: string | null;
  currentStatus?: string | number | null;
  timeline?: RawStudentDocumentTimelineEvent[] | null;
};

type RawStudentValidationRuleResult = {
  ruleId?: string | null;
  title?: string | null;
  severity?: string | number | null;
  weight?: number | null;
  details?: string | null;
};

type RawStudentValidationReport = {
  submissionId?: string | null;
  fileName?: string | null;
  status?: string | number | null;
  score?: number | null;
  validatedAt?: string | null;
  results?: RawStudentValidationRuleResult[] | null;
};

type MockDocumentRecord = {
  submissionId: string;
  fileName: string;
  uploadedAt: string;
};

const MOCK_STORAGE_KEY = "siwes360-student-document-record";

const validationStatusMap: Record<number, DocumentValidationStatus> = {
  1: "Uploaded",
  2: "Processing",
  3: "Queued",
  4: "Validating",
  5: "Passed",
  6: "Completed",
  7: "Failed",
};

const severityMap = {
  1: "Pass",
  2: "Warning",
  3: "Fail",
} as const;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeValidationStatus(
  value: string | number | null | undefined,
): DocumentValidationStatus {
  if (typeof value === "number") {
    return validationStatusMap[value] ?? "Uploaded";
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim() as DocumentValidationStatus;
  }

  return "Uploaded";
}

function normalizeSeverity(
  value: string | number | null | undefined,
): StudentValidationRuleResult["severity"] {
  if (typeof value === "number") {
    return severityMap[value as keyof typeof severityMap] ?? "Warning";
  }

  if (value === "Pass" || value === "Warning" || value === "Fail") {
    return value;
  }

  return "Warning";
}

function normalizeStudentDocumentStatus(
  submissionId: string,
  payload: RawStudentDocumentStatus | StudentDocumentStatus | null | undefined,
): StudentDocumentStatus | null {
  if (!payload) {
    return null;
  }

  return {
    submissionId: payload.submissionId?.trim() || submissionId,
    fileName: payload.fileName?.trim() || "Submitted report",
    currentStatus: normalizeValidationStatus(payload.currentStatus),
    timeline: (payload.timeline ?? []).map((event) => ({
      status:
        typeof event.status === "number"
          ? normalizeValidationStatus(event.status)
          : event.status?.trim() || "Updated",
      occurredAt: event.occurredAt?.trim() || new Date().toISOString(),
      description: event.description?.trim() || "Status updated.",
    })),
  };
}

function normalizeStudentValidationReport(
  submissionId: string,
  payload: RawStudentValidationReport | StudentValidationReport | null | undefined,
): StudentValidationReport | null {
  if (!payload) {
    return null;
  }

  return {
    submissionId: payload.submissionId?.trim() || submissionId,
    fileName: payload.fileName?.trim() || "Submitted report",
    status: normalizeValidationStatus(payload.status),
    score: typeof payload.score === "number" ? payload.score : null,
    validatedAt: payload.validatedAt?.trim() || null,
    results: (payload.results ?? []).map((result) => ({
      ruleId: result.ruleId?.trim() || "Rule",
      title: result.title?.trim() || "Check",
      severity: normalizeSeverity(result.severity),
      weight: typeof result.weight === "number" ? result.weight : 0,
      details: result.details?.trim() || "No details available.",
    })),
  };
}

function buildMockStatus(record: MockDocumentRecord): StudentDocumentStatus {
  const uploadedAt = new Date(record.uploadedAt).getTime();
  const elapsedSeconds = Math.floor((Date.now() - uploadedAt) / 1000);

  if (elapsedSeconds >= 20) {
    return {
      submissionId: record.submissionId,
      fileName: record.fileName,
      currentStatus: "Completed",
      timeline: [
        {
          status: "Uploaded",
          occurredAt: record.uploadedAt,
          description: "Document uploaded successfully.",
        },
        {
          status: "Queued",
          occurredAt: new Date(uploadedAt + 2_000).toISOString(),
          description: "Document queued for validation.",
        },
        {
          status: "Validating",
          occurredAt: new Date(uploadedAt + 8_000).toISOString(),
          description: "Validation process started.",
        },
        {
          status: "Completed",
          occurredAt: new Date(uploadedAt + 20_000).toISOString(),
          description: "Validation completed successfully.",
        },
      ],
    };
  }

  if (elapsedSeconds >= 8) {
    return {
      submissionId: record.submissionId,
      fileName: record.fileName,
      currentStatus: "Validating",
      timeline: [
        {
          status: "Uploaded",
          occurredAt: record.uploadedAt,
          description: "Document uploaded successfully.",
        },
        {
          status: "Queued",
          occurredAt: new Date(uploadedAt + 2_000).toISOString(),
          description: "Document queued for validation.",
        },
        {
          status: "Validating",
          occurredAt: new Date(uploadedAt + 8_000).toISOString(),
          description: "Validation process started.",
        },
      ],
    };
  }

  return {
    submissionId: record.submissionId,
    fileName: record.fileName,
    currentStatus: "Queued",
    timeline: [
      {
        status: "Uploaded",
        occurredAt: record.uploadedAt,
        description: "Document uploaded successfully.",
      },
      {
        status: "Queued",
        occurredAt: new Date(uploadedAt + 2_000).toISOString(),
        description: "Document queued for validation.",
      },
    ],
  };
}

function buildMockValidationReport(record: MockDocumentRecord): StudentValidationReport {
  const status = buildMockStatus(record);
  const isComplete = status.currentStatus === "Completed";

  return {
    submissionId: record.submissionId,
    fileName: record.fileName,
    status: status.currentStatus,
    score: isComplete ? 84 : null,
    validatedAt: isComplete ? status.timeline.at(-1)?.occurredAt ?? null : null,
    results: isComplete
      ? [
          {
            ruleId: "R002",
            title: "Front matter sections present",
            severity: "Pass",
            weight: 25,
            details: "All required front-matter sections found.",
          },
          {
            ruleId: "R101",
            title: "Paper size is A4",
            severity: "Pass",
            weight: 8,
            details: "Page size looks like A4.",
          },
          {
            ruleId: "R102",
            title: "Margins",
            severity: "Warning",
            weight: 7,
            details: "Margins are close to the required specification.",
          },
        ]
      : [],
  };
}

function getStoredMockRecord() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(MOCK_STORAGE_KEY);
  return value ? (JSON.parse(value) as MockDocumentRecord) : null;
}

function setStoredMockRecord(record: MockDocumentRecord) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(record));
  }
}

export function getStoredSubmissionId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(SUBMISSION_ID_STORAGE_KEY);
}

export function setStoredSubmissionId(submissionId: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SUBMISSION_ID_STORAGE_KEY, submissionId);
  }
}

export function clearStoredSubmissionId() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SUBMISSION_ID_STORAGE_KEY);
  }
}

export async function getCurrentStudentSubmissionId() {
  const storedSubmissionId = getStoredSubmissionId();

  if (hasConfiguredApiBaseUrl()) {
    try {
      const profileResponse = await apiClient.get<UserProfileApiResponse>(
        apiEndpoints.userProfile.me,
      );
      const studentId = profileResponse.data?.data?.id?.trim();

      if (!studentId) {
        return storedSubmissionId;
      }

      const assessmentResponse = await apiClient.get<ApiEnvelope<AssessmentDto>>(
        apiEndpoints.assessment.byStudent(studentId),
      );
      const submissionId = assessmentResponse.data?.data?.documentSubmissionId?.trim();

      if (submissionId) {
        setStoredSubmissionId(submissionId);
        return submissionId;
      }
      clearStoredSubmissionId();
      return null;
    } catch (error) {
      if (storedSubmissionId) {
        return storedSubmissionId;
      }

      throw new Error(
        getApiErrorMessage(error, "Unable to determine your current report submission."),
      );
    }
  }

  return storedSubmissionId;
}

export async function uploadStudentDocument(
  payload: StudentDocumentUploadPayload,
): Promise<StudentDocumentUploadResult> {
  if (hasConfiguredApiBaseUrl()) {
    const formData = new FormData();
    formData.append("file", payload.file);

    const response = await apiClient.post<ApiEnvelope<string>>(
      apiEndpoints.document.upload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const submissionId = response.data?.data?.trim();

    if (!submissionId) {
      throw new Error("Upload completed but no submission id was returned.");
    }

    setStoredSubmissionId(submissionId);

    return {
      submissionId,
      message: response.data?.message?.trim() || "Document uploaded successfully.",
    };
  }

  await wait(900);

  const mockRecord: MockDocumentRecord = {
    submissionId: crypto.randomUUID(),
    fileName: payload.file.name,
    uploadedAt: new Date().toISOString(),
  };

  setStoredSubmissionId(mockRecord.submissionId);
  setStoredMockRecord(mockRecord);

  return {
    submissionId: mockRecord.submissionId,
    message: "Document uploaded into local mock storage.",
  };
}

export async function getStudentDocumentStatus(
  submissionId: string,
): Promise<StudentDocumentStatus | null> {
  if (!submissionId) {
    return null;
  }

  if (hasConfiguredApiBaseUrl()) {
    try {
      const response = await apiClient.get<ApiEnvelope<RawStudentDocumentStatus>>(
        apiEndpoints.document.status(submissionId),
      );

      return normalizeStudentDocumentStatus(submissionId, response.data?.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        clearStoredSubmissionId();
        return null;
      }

      throw new Error(getApiErrorMessage(error, "Unable to load your report status."));
    }
  }

  await wait(250);

  const record = getStoredMockRecord();
  if (!record || record.submissionId !== submissionId) {
    return null;
  }

  return buildMockStatus(record);
}

export async function getStudentValidationReport(
  submissionId: string,
): Promise<StudentValidationReport | null> {
  if (!submissionId) {
    return null;
  }

  if (hasConfiguredApiBaseUrl()) {
    try {
      const response = await apiClient.get<ApiEnvelope<RawStudentValidationReport>>(
        apiEndpoints.document.validationReport(submissionId),
      );

      return normalizeStudentValidationReport(submissionId, response.data?.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw new Error(getApiErrorMessage(error, "Unable to load your validation report."));
    }
  }

  await wait(250);

  const record = getStoredMockRecord();
  if (!record || record.submissionId !== submissionId) {
    return null;
  }

  return buildMockValidationReport(record);
}
