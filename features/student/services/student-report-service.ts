"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  StudentDocumentStatus,
  StudentDocumentUploadPayload,
  StudentDocumentUploadResult,
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

type MockDocumentRecord = {
  submissionId: string;
  fileName: string;
  uploadedAt: string;
};

const MOCK_STORAGE_KEY = "siwes360-student-document-record";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export async function getCurrentStudentSubmissionId() {
  if (hasConfiguredApiBaseUrl()) {
    try {
      const profileResponse = await apiClient.get<UserProfileApiResponse>(
        apiEndpoints.userProfile.me,
      );
      const studentId = profileResponse.data?.data?.id?.trim();

      if (!studentId) {
        return getStoredSubmissionId();
      }

      const assessmentResponse = await apiClient.get<ApiEnvelope<AssessmentDto>>(
        apiEndpoints.assessment.byStudent(studentId),
      );
      const submissionId = assessmentResponse.data?.data?.documentSubmissionId?.trim();

      if (submissionId) {
        setStoredSubmissionId(submissionId);
        return submissionId;
      }
    } catch {
      return getStoredSubmissionId();
    }

    return getStoredSubmissionId();
  }

  return getStoredSubmissionId();
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
    const response = await apiClient.get<ApiEnvelope<StudentDocumentStatus>>(
      apiEndpoints.document.status(submissionId),
    );

    return response.data?.data ?? null;
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
    const response = await apiClient.get<ApiEnvelope<StudentValidationReport>>(
      apiEndpoints.document.validationReport(submissionId),
    );

    return response.data?.data ?? null;
  }

  await wait(250);

  const record = getStoredMockRecord();
  if (!record || record.submissionId !== submissionId) {
    return null;
  }

  return buildMockValidationReport(record);
}
