"use client";

import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { StudentScoreBreakdown } from "@/features/student/types/student-scores";
import type { SupervisorScoreSubmission } from "@/features/supervisor/types/supervisor-students";
import type { AdminScoreRecord } from "@/features/admin/types/admin-students";

type MockDocumentRecord = {
  submissionId: string;
  fileName: string;
  uploadedAt: string;
};

const DOCUMENT_STORAGE_KEY = "siwes360-student-document-record";
const SUPERVISOR_STORAGE_KEY = "siwes360-supervisor-submissions";
const ADMIN_STORAGE_KEY = "siwes360-admin-score-records";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type UserProfileApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
  } | null;
};

type AssessmentApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

type AssessmentDto = {
  id: string;
  studentId: string;
  documentValidationScore?: number | null;
  reportScore?: number | null;
  supervisorScore?: number | null;
  logbookScore?: number | null;
  presentationScore?: number | null;
  totalScore?: number;
  isComplete?: boolean;
  isFinalized?: boolean;
  grade?: string | null;
};

function getMockReportScore(uploadedAt: string) {
  const elapsedSeconds = Math.floor((Date.now() - new Date(uploadedAt).getTime()) / 1000);
  return elapsedSeconds >= 20 ? 84 : null;
}

export async function getStudentScores(): Promise<StudentScoreBreakdown> {
  if (hasConfiguredApiBaseUrl()) {
    try {
      const profileResponse = await apiClient.get<UserProfileApiResponse>(apiEndpoints.userProfile.me);
      const studentId = profileResponse.data?.data?.id?.trim();

      if (!studentId) {
        return {
          validation: null,
          report: null,
          supervisor: null,
          logbook: null,
          presentation: null,
          total: null,
          grade: null,
          isFinalized: false,
          status: "incomplete",
        };
      }

      const assessmentResponse = await apiClient.get<AssessmentApiEnvelope<AssessmentDto>>(
        apiEndpoints.assessment.byStudent(studentId),
      );

      const assessment = assessmentResponse.data?.data;

      if (!assessment) {
        return {
          validation: null,
          report: null,
          supervisor: null,
          logbook: null,
          presentation: null,
          total: null,
          grade: null,
          isFinalized: false,
          status: "incomplete",
        };
      }

      return {
        validation: assessment.documentValidationScore ?? null,
        report: assessment.reportScore ?? null,
        supervisor: assessment.supervisorScore ?? null,
        logbook: assessment.logbookScore ?? null,
        presentation: assessment.presentationScore ?? null,
        total: assessment.isComplete ? (assessment.totalScore ?? null) : null,
        grade: assessment.grade ?? null,
        isFinalized: assessment.isFinalized === true,
        status: assessment.isComplete ? "complete" : "incomplete",
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          validation: null,
          report: null,
          supervisor: null,
          logbook: null,
          presentation: null,
          total: null,
          grade: null,
          isFinalized: false,
          status: "incomplete",
        };
      }

      throw new Error(getApiErrorMessage(error, "Unable to load your assessment scores."));
    }
  }

  await wait(300);

  if (typeof window === "undefined") {
    return {
      validation: null,
      report: null,
      supervisor: null,
      logbook: null,
      presentation: null,
      total: null,
      grade: null,
      isFinalized: false,
      status: "incomplete",
    };
  }

  const reportValue = window.localStorage.getItem(DOCUMENT_STORAGE_KEY);
  const supervisorValue = window.localStorage.getItem(SUPERVISOR_STORAGE_KEY);
  const adminValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);

  const report = reportValue
    ? (JSON.parse(reportValue) as MockDocumentRecord)
    : null;
  const supervisorScores = supervisorValue
    ? (JSON.parse(supervisorValue) as SupervisorScoreSubmission[])
    : [];
  const adminScores = adminValue ? (JSON.parse(adminValue) as AdminScoreRecord[]) : [];

  const supervisor = supervisorScores.find((item) => item.matricNumber === "CSC/2021/014")?.score ?? null;
  const admin = adminScores.find((item) => item.matricNumber === "CSC/2021/014") ?? null;
  const reportScore = report ? getMockReportScore(report.uploadedAt) : null;
  const totalParts = [reportScore, supervisor, admin?.logbookScore ?? null, admin?.presentationScore ?? null];
  const isComplete = totalParts.every((item) => item !== null);

  return {
    validation: reportScore,
    report: reportScore,
    supervisor,
    logbook: admin?.logbookScore ?? null,
    presentation: admin?.presentationScore ?? null,
    total: isComplete ? totalParts.reduce((sum, item) => sum + (item ?? 0), 0) : null,
    grade: null,
    isFinalized: false,
    status: isComplete ? "complete" : "incomplete",
  };
}
