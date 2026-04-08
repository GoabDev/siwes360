"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { StudentWorkflowProgress } from "@/features/student/types/student-workflow";
import type { SupervisorScoreSubmission } from "@/features/supervisor/types/supervisor-students";
import type { AdminScoreRecord } from "@/features/admin/types/admin-students";

const DOCUMENT_STORAGE_KEY = "siwes360-student-document-record";
const SUPERVISOR_STORAGE_KEY = "siwes360-supervisor-submissions";
const ADMIN_STORAGE_KEY = "siwes360-admin-score-records";

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
    firstname?: string;
    lastname?: string;
  } | null;
};

type RawWorkflowStep = {
  key?: string | null;
  label?: string | null;
  status?: string | null;
  isDone?: boolean | null;
};

type RawWorkflowProgress = {
  studentId?: string | null;
  studentFullName?: string | null;
  steps?: RawWorkflowStep[] | null;
};

type MockDocumentRecord = {
  submissionId: string;
  fileName: string;
  uploadedAt: string;
};

function normalizeWorkflowProgress(
  payload: RawWorkflowProgress | null | undefined,
): StudentWorkflowProgress | null {
  if (!payload?.studentId) {
    return null;
  }

  return {
    studentId: payload.studentId,
    studentFullName: payload.studentFullName?.trim() || "Student",
    steps: (payload.steps ?? []).map((step, index) => ({
      key: step.key?.trim() || `workflow-step-${index + 1}`,
      label: step.label?.trim() || "Workflow step",
      status: step.status?.trim() || "Pending",
      isDone: step.isDone === true,
    })),
  };
}

export async function getStudentWorkflowProgress(): Promise<StudentWorkflowProgress | null> {
  if (hasConfiguredApiBaseUrl()) {
    const profileResponse = await apiClient.get<UserProfileApiResponse>(apiEndpoints.userProfile.me);
    const studentId = profileResponse.data?.data?.id?.trim();

    if (!studentId) {
      return null;
    }

    const workflowResponse = await apiClient.get<ApiEnvelope<RawWorkflowProgress>>(
      apiEndpoints.assessment.studentWorkflow(studentId),
    );

    return normalizeWorkflowProgress(workflowResponse.data?.data);
  }

  if (typeof window === "undefined") {
    return null;
  }

  const documentValue = window.localStorage.getItem(DOCUMENT_STORAGE_KEY);
  const supervisorValue = window.localStorage.getItem(SUPERVISOR_STORAGE_KEY);
  const adminValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);

  const documentRecord = documentValue ? (JSON.parse(documentValue) as MockDocumentRecord) : null;
  const supervisorScores = supervisorValue
    ? (JSON.parse(supervisorValue) as SupervisorScoreSubmission[])
    : [];
  const adminScores = adminValue ? (JSON.parse(adminValue) as AdminScoreRecord[]) : [];

  const hasSupervisorScore = supervisorScores.some((item) => item.matricNumber === "CSC/2021/014");
  const adminRecord = adminScores.find((item) => item.matricNumber === "CSC/2021/014") ?? null;
  const hasAdminScores = Boolean(
    adminRecord &&
      adminRecord.logbookScore !== null &&
      adminRecord.logbookScore !== undefined &&
      adminRecord.presentationScore !== null &&
      adminRecord.presentationScore !== undefined,
  );

  return {
    studentId: "mock-student-id",
    studentFullName: "Johnson Adebayo",
    steps: [
      { key: "profile-setup", label: "Profile setup", status: "Done", isDone: true },
      {
        key: "report-uploaded",
        label: "Report uploaded",
        status: documentRecord ? "Done" : "Pending",
        isDone: Boolean(documentRecord),
      },
      {
        key: "supervisor-score-submitted",
        label: "Supervisor score submitted",
        status: hasSupervisorScore ? "Done" : "Pending",
        isDone: hasSupervisorScore,
      },
      {
        key: "admin-grading-submitted",
        label: "Admin grading submitted",
        status: hasAdminScores ? "Done" : "Pending",
        isDone: hasAdminScores,
      },
      {
        key: "final-result-complete",
        label: "Final result complete",
        status: "Pending",
        isDone: false,
      },
    ],
  };
}
