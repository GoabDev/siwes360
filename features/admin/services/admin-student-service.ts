"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import { withDerivedReportProgress } from "@/features/student/utils/report-progress";
import type { StudentReportRecord } from "@/features/student/types/student-report";
import type { AdminScoreRecord, AdminStudentRecord } from "@/features/admin/types/admin-students";
import type { SupervisorScoreSubmission } from "@/features/supervisor/types/supervisor-students";

const ADMIN_STORAGE_KEY = "siwes360-admin-score-records";
const REPORT_STORAGE_KEY = "siwes360-student-report";
const SUPERVISOR_STORAGE_KEY = "siwes360-supervisor-submissions";

const baseStudents = [
  { matricNumber: "CSC/2021/014", fullName: "Johnson Adebayo", department: "Computer Science" },
  { matricNumber: "IFT/2021/009", fullName: "Mariam Sani", department: "Information Technology" },
  { matricNumber: "CSC/2021/021", fullName: "David Ekanem", department: "Computer Science" },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStoredAdminScores(): AdminScoreRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = window.localStorage.getItem(ADMIN_STORAGE_KEY);
  return value ? (JSON.parse(value) as AdminScoreRecord[]) : [];
}

function setStoredAdminScores(records: AdminScoreRecord[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(records));
  }
}

function getStoredSupervisorScores(): SupervisorScoreSubmission[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = window.localStorage.getItem(SUPERVISOR_STORAGE_KEY);
  return value ? (JSON.parse(value) as SupervisorScoreSubmission[]) : [];
}

function getStoredReport(): StudentReportRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(REPORT_STORAGE_KEY);
  return value ? withDerivedReportProgress(JSON.parse(value) as StudentReportRecord) : null;
}

function buildAdminStudentRecord(
  student: (typeof baseStudents)[number],
  adminScores: AdminScoreRecord[],
  supervisorScores: SupervisorScoreSubmission[],
  report: StudentReportRecord | null,
): AdminStudentRecord {
  const adminScore = adminScores.find((item) => item.matricNumber === student.matricNumber) ?? null;
  const supervisorScore =
    supervisorScores.find((item) => item.matricNumber === student.matricNumber)?.score ?? null;
  const reportScore = report && report.reportScore && student.matricNumber === "CSC/2021/014"
    ? report.reportScore
    : null;
  const totalParts = [reportScore, supervisorScore, adminScore?.logbookScore ?? null, adminScore?.presentationScore ?? null];
  const hasAllScores = totalParts.every((item) => item !== null);
  const totalScore = hasAllScores
    ? totalParts.reduce((sum, item) => sum + (item ?? 0), 0)
    : null;

  return {
    matricNumber: student.matricNumber,
    fullName: student.fullName,
    department: student.department,
    reportScore,
    supervisorScore,
    logbookScore: adminScore?.logbookScore ?? null,
    presentationScore: adminScore?.presentationScore ?? null,
    totalScore,
    status: hasAllScores
      ? "complete"
      : reportScore !== null || supervisorScore !== null || adminScore !== null
        ? "ready"
        : "incomplete",
  };
}

export async function getAdminStudents(): Promise<AdminStudentRecord[]> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<AdminStudentRecord[]>(`${apiEndpoints.admin.profile}/students`);
    return response.data;
  }

  await wait(500);

  const adminScores = getStoredAdminScores();
  const supervisorScores = getStoredSupervisorScores();
  const report = getStoredReport();

  return baseStudents.map((student) =>
    buildAdminStudentRecord(student, adminScores, supervisorScores, report),
  );
}

export async function getAdminStudentByMatric(matricNumber: string) {
  const students = await getAdminStudents();
  return students.find((student) => student.matricNumber === matricNumber) ?? null;
}

export async function submitAdminScores(input: {
  matricNumber: string;
  logbookScore: number;
  presentationScore: number;
  note: string;
}) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<{ message: string; record: AdminScoreRecord }>(
      `${apiEndpoints.admin.profile}/scores`,
      input,
    );
    return response.data;
  }

  await wait(750);

  const nextRecord: AdminScoreRecord = {
    matricNumber: input.matricNumber,
    logbookScore: input.logbookScore,
    presentationScore: input.presentationScore,
    updatedAt: new Date().toISOString(),
  };

  const records = getStoredAdminScores().filter((item) => item.matricNumber !== input.matricNumber);
  setStoredAdminScores([nextRecord, ...records]);

  return {
    message: "Admin grading saved locally. Backend grading submission will replace this service later.",
    record: nextRecord,
  };
}
