"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import { withDerivedReportProgress } from "@/features/student/utils/report-progress";
import type { StudentReportRecord } from "@/features/student/types/student-report";
import type {
  AdminScoreRecord,
  AdminStudentRecord,
  AdminStudentsQueryParams,
  PaginatedAdminStudents,
} from "@/features/admin/types/admin-students";
import type { SupervisorScoreSubmission } from "@/features/supervisor/types/supervisor-students";

const ADMIN_STORAGE_KEY = "siwes360-admin-score-records";
const REPORT_STORAGE_KEY = "siwes360-student-report";
const SUPERVISOR_STORAGE_KEY = "siwes360-supervisor-submissions";

const baseStudents = [
  { matricNumber: "CSC/2021/014", fullName: "Johnson Adebayo", department: "Computer Science" },
  { matricNumber: "IFT/2021/009", fullName: "Mariam Sani", department: "Information Technology" },
  { matricNumber: "CSC/2021/021", fullName: "David Ekanem", department: "Computer Science" },
];

type UserProfileStudentRecord = {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  matricNo?: string;
  departmentName?: string;
};

type PaginatedApiPayload =
  | UserProfileStudentRecord[]
  | {
      items?: UserProfileStudentRecord[];
      results?: UserProfileStudentRecord[];
      records?: UserProfileStudentRecord[];
      data?: UserProfileStudentRecord[];
      pageNumber?: number;
      currentPage?: number;
      pageSize?: number;
      totalCount?: number;
      totalItems?: number;
      totalPages?: number;
    };

type PaginatedApiEnvelope = {
  success?: boolean;
  message?: string;
  data?: PaginatedApiPayload;
};

type PaginatedApiObject = Exclude<PaginatedApiPayload, UserProfileStudentRecord[]>;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapUserProfileStudentToAdminRecord(student: UserProfileStudentRecord): AdminStudentRecord {
  return {
    matricNumber: student.matricNo ?? "",
    fullName: `${student.firstname ?? ""} ${student.lastname ?? ""}`.trim() || "Unnamed student",
    department: student.departmentName ?? "Unknown department",
    reportScore: null,
    supervisorScore: null,
    logbookScore: null,
    presentationScore: null,
    totalScore: null,
    status: "incomplete",
  };
}

function parsePaginatedStudentsResponse(
  payload: PaginatedApiEnvelope | PaginatedApiPayload,
  fallbackParams: Required<Pick<AdminStudentsQueryParams, "pageNumber" | "pageSize">>,
): PaginatedAdminStudents {
  const rawData =
    typeof payload === "object" && payload !== null && "data" in payload
      ? payload.data
      : payload;

  const sourceMeta =
    rawData && !Array.isArray(rawData)
      ? (rawData as PaginatedApiObject)
      : undefined;

  const container =
    Array.isArray(rawData) || !rawData
      ? rawData
      : sourceMeta?.items ?? sourceMeta?.results ?? sourceMeta?.records ?? sourceMeta?.data ?? [];

  const items = (Array.isArray(container) ? container : []).map(mapUserProfileStudentToAdminRecord);
  const totalCount = sourceMeta?.totalCount ?? sourceMeta?.totalItems ?? items.length;
  const pageSize = sourceMeta?.pageSize ?? fallbackParams.pageSize;
  const pageNumber = sourceMeta?.pageNumber ?? sourceMeta?.currentPage ?? fallbackParams.pageNumber;
  const totalPages = sourceMeta?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items,
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
  };
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

export async function getAdminStudents(
  params: AdminStudentsQueryParams = {},
): Promise<PaginatedAdminStudents> {
  const normalizedParams = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 10,
    searchTerm: params.searchTerm?.trim() ?? "",
  };

  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<PaginatedApiEnvelope>(apiEndpoints.userProfile.students, {
      params: normalizedParams,
    });

    return parsePaginatedStudentsResponse(response.data, normalizedParams);
  }

  await wait(500);

  const adminScores = getStoredAdminScores();
  const supervisorScores = getStoredSupervisorScores();
  const report = getStoredReport();

  const filteredStudents = baseStudents
    .filter((student) => {
      if (!normalizedParams.searchTerm) {
        return true;
      }

      const normalizedSearch = normalizedParams.searchTerm.toLowerCase();
      return (
        student.fullName.toLowerCase().includes(normalizedSearch) ||
        student.matricNumber.toLowerCase().includes(normalizedSearch) ||
        student.department.toLowerCase().includes(normalizedSearch)
      );
    })
    .map((student) => buildAdminStudentRecord(student, adminScores, supervisorScores, report));

  const startIndex = (normalizedParams.pageNumber - 1) * normalizedParams.pageSize;
  const items = filteredStudents.slice(startIndex, startIndex + normalizedParams.pageSize);

  return {
    items,
    pageNumber: normalizedParams.pageNumber,
    pageSize: normalizedParams.pageSize,
    totalCount: filteredStudents.length,
    totalPages: Math.max(1, Math.ceil(filteredStudents.length / normalizedParams.pageSize)),
  };
}

export async function getAdminStudentByMatric(matricNumber: string) {
  const students = await getAdminStudents({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: matricNumber,
  });
  return students.items.find((student) => student.matricNumber === matricNumber) ?? null;
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
