"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  AdminScoreRecord,
  AdminStudentRecord,
  AdminStudentsQueryParams,
  PaginatedAdminStudents,
} from "@/features/admin/types/admin-students";
import type { SupervisorScoreSubmission } from "@/features/supervisor/types/supervisor-students";

const ADMIN_STORAGE_KEY = "siwes360-admin-score-records";
const DOCUMENT_STORAGE_KEY = "siwes360-student-document-record";
const SUPERVISOR_STORAGE_KEY = "siwes360-supervisor-submissions";

type MockDocumentRecord = {
  submissionId: string;
  fileName: string;
  uploadedAt: string;
};

type UserProfileStudentRecord = {
  id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  matricNo?: string;
  departmentName?: string;
};

type PaginatedUserProfilePayload =
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

type PaginatedUserProfileEnvelope = {
  success?: boolean;
  message?: string;
  data?: PaginatedUserProfilePayload;
};

type PaginatedUserProfileObject = Exclude<PaginatedUserProfilePayload, UserProfileStudentRecord[]>;

const baseStudents = [
  { assessmentId: "mock-assessment-1", matricNumber: "CSC/2021/014", fullName: "Johnson Adebayo", department: "Computer Science" },
  { assessmentId: "mock-assessment-2", matricNumber: "IFT/2021/009", fullName: "Mariam Sani", department: "Information Technology" },
  { assessmentId: "mock-assessment-3", matricNumber: "CSC/2021/021", fullName: "David Ekanem", department: "Computer Science" },
];

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

type PaginatedAssessmentResponse = {
  success?: boolean;
  message?: string;
  data?: {
    items?: AssessmentSummaryDto[];
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  } | null;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapAssessmentToAdminRecord(assessment: AssessmentSummaryDto): AdminStudentRecord {
  const hasPartialScores =
    assessment.reportScore !== null ||
    assessment.supervisorScore !== null ||
    assessment.logbookScore !== null ||
    assessment.presentationScore !== null;

  return {
    assessmentId: assessment.id,
    matricNumber: assessment.matricNumber,
    fullName: assessment.studentFullName,
    department: "Assigned department",
    reportScore: assessment.reportScore ?? null,
    supervisorScore: assessment.supervisorScore ?? null,
    logbookScore: assessment.logbookScore ?? null,
    presentationScore: assessment.presentationScore ?? null,
    totalScore: assessment.isComplete ? assessment.totalScore : null,
    status: assessment.isComplete ? "complete" : hasPartialScores ? "ready" : "incomplete",
  };
}

function mapUserProfileStudentToAdminRecord(student: UserProfileStudentRecord): AdminStudentRecord {
  return {
    assessmentId: null,
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
  payload: PaginatedUserProfileEnvelope | PaginatedUserProfilePayload,
  fallbackParams: Required<Pick<AdminStudentsQueryParams, "pageNumber" | "pageSize">>,
): PaginatedAdminStudents {
  const rawData =
    typeof payload === "object" && payload !== null && "data" in payload
      ? payload.data
      : payload;

  const sourceMeta =
    rawData && !Array.isArray(rawData)
      ? (rawData as PaginatedUserProfileObject)
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

function mergeStudentWithAssessment(
  student: AdminStudentRecord,
  assessment: AssessmentSummaryDto | undefined,
): AdminStudentRecord {
  if (!assessment) {
    return student;
  }

  const hasPartialScores =
    assessment.reportScore !== null ||
    assessment.supervisorScore !== null ||
    assessment.logbookScore !== null ||
    assessment.presentationScore !== null;

  return {
    ...student,
    assessmentId: assessment.id,
    reportScore: assessment.reportScore ?? null,
    supervisorScore: assessment.supervisorScore ?? null,
    logbookScore: assessment.logbookScore ?? null,
    presentationScore: assessment.presentationScore ?? null,
    totalScore: assessment.isComplete ? assessment.totalScore : null,
    status: assessment.isComplete ? "complete" : hasPartialScores ? "ready" : "incomplete",
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

function getMockReportScore(uploadedAt: string) {
  const elapsedSeconds = Math.floor((Date.now() - new Date(uploadedAt).getTime()) / 1000);
  return elapsedSeconds >= 20 ? 84 : null;
}

function getStoredReport(): MockDocumentRecord | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(DOCUMENT_STORAGE_KEY);
  return value ? (JSON.parse(value) as MockDocumentRecord) : null;
}

function buildAdminStudentRecord(
  student: (typeof baseStudents)[number],
  adminScores: AdminScoreRecord[],
  supervisorScores: SupervisorScoreSubmission[],
  report: MockDocumentRecord | null,
): AdminStudentRecord {
  const adminScore = adminScores.find((item) => item.matricNumber === student.matricNumber) ?? null;
  const supervisorScore =
    supervisorScores.find((item) => item.matricNumber === student.matricNumber)?.score ?? null;
  const reportScore = report && student.matricNumber === "CSC/2021/014"
    ? getMockReportScore(report.uploadedAt)
    : null;
  const totalParts = [reportScore, supervisorScore, adminScore?.logbookScore ?? null, adminScore?.presentationScore ?? null];
  const hasAllScores = totalParts.every((item) => item !== null);
  const totalScore = hasAllScores
    ? totalParts.reduce((sum, item) => sum + (item ?? 0), 0)
    : null;

  return {
    assessmentId: student.assessmentId,
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
    const [studentsResponse, assessmentsResponse] = await Promise.all([
      apiClient.get<PaginatedUserProfileEnvelope>(apiEndpoints.userProfile.students, {
        params: normalizedParams,
      }),
      apiClient.get<PaginatedAssessmentResponse>(apiEndpoints.assessment.admin, {
        params: {
          pageNumber: 1,
          pageSize: 1000,
          searchTerm: normalizedParams.searchTerm,
        },
      }),
    ]);

    const studentsPage = parsePaginatedStudentsResponse(
      studentsResponse.data,
      normalizedParams,
    );
    const assessments = assessmentsResponse.data?.data?.items ?? [];
    const assessmentByMatric = new Map(
      assessments.map((assessment) => [assessment.matricNumber, assessment]),
    );

    return {
      ...studentsPage,
      items: studentsPage.items.map((student) =>
        mergeStudentWithAssessment(student, assessmentByMatric.get(student.matricNumber)),
      ),
    };
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
    pageSize: 50,
    searchTerm: matricNumber,
  });
  return students.items.find((student) => student.matricNumber === matricNumber) ?? null;
}

export async function submitAdminScores(input: {
  assessmentId: string | null;
  matricNumber: string;
  logbookScore: number;
  presentationScore: number;
  note: string;
}) {
  if (hasConfiguredApiBaseUrl()) {
    if (!input.assessmentId) {
      throw new Error("This student does not have an assessment record yet.");
    }

    await apiClient.post<{ message?: string }>(apiEndpoints.assessment.adminScores, {
      assessmentId: input.assessmentId,
      logbookScore: input.logbookScore,
      presentationScore: input.presentationScore,
    });

    return {
      message: "Administrative scores saved successfully.",
      record: {
        assessmentId: input.assessmentId,
        matricNumber: input.matricNumber,
        logbookScore: input.logbookScore,
        presentationScore: input.presentationScore,
        updatedAt: new Date().toISOString(),
      } satisfies AdminScoreRecord,
    };
  }

  await wait(750);

  const nextRecord: AdminScoreRecord = {
    assessmentId: input.assessmentId ?? undefined,
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
