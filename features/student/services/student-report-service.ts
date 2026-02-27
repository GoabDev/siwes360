"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  StudentReportRecord,
  StudentReportUploadPayload,
} from "@/features/student/types/student-report";
import { withDerivedReportProgress } from "@/features/student/utils/report-progress";

const STORAGE_KEY = "siwes360-student-report";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getStudentReport(): Promise<StudentReportRecord | null> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<StudentReportRecord | null>(
      apiEndpoints.student.reportUpload,
    );
    return response.data;
  }

  await wait(500);

  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  return value ? withDerivedReportProgress(JSON.parse(value) as StudentReportRecord) : null;
}

export async function uploadStudentReport(
  payload: StudentReportUploadPayload,
): Promise<{ message: string; report: StudentReportRecord }> {
  if (hasConfiguredApiBaseUrl()) {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("summary", payload.summary);
    formData.append("file", payload.file);

    const response = await apiClient.post<{ message: string; report: StudentReportRecord }>(
      apiEndpoints.student.reportUpload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  await wait(1000);

  const report: StudentReportRecord = {
    title: payload.title,
    fileName: payload.file.name,
    fileSize: payload.file.size,
    summary: payload.summary,
    submittedAt: new Date().toISOString(),
    status: "uploaded",
    reportScore: null,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  }

  return {
    message: "Report uploaded into local mock storage. Backend upload will replace this service later.",
    report: withDerivedReportProgress(report),
  };
}
