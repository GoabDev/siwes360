"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  PaginatedSupervisorStudents,
  SupervisorScoreSubmission,
  SupervisorStudentRecord,
  SupervisorStudentsQueryParams,
} from "@/features/supervisor/types/supervisor-students";

const SUBMISSIONS_STORAGE_KEY = "siwes360-supervisor-submissions";

const mockStudents: SupervisorStudentRecord[] = [
  {
    assessmentId: "mock-assessment-1",
    matricNumber: "CSC/2021/014",
    fullName: "Johnson Adebayo",
    department: "Computer Science",
    placementCompany: "Interswitch",
    placementAddress: "12 Marina Road, Lagos",
    status: "pending",
  },
  {
    assessmentId: "mock-assessment-2",
    matricNumber: "IFT/2021/009",
    fullName: "Mariam Sani",
    department: "Information Technology",
    placementCompany: "MainOne",
    placementAddress: "Plot 5 Adeola Odeku, Victoria Island",
    status: "pending",
  },
];

type AssessmentSummaryDto = {
  id: string;
  matricNumber: string;
  studentFullName: string;
  supervisorScore?: number | null;
  isComplete?: boolean;
  isFinalized?: boolean;
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

function getStoredSubmissions(): SupervisorScoreSubmission[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = window.localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
  return value ? (JSON.parse(value) as SupervisorScoreSubmission[]) : [];
}

function setStoredSubmissions(submissions: SupervisorScoreSubmission[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  }
}

function mapAssessmentToSupervisorStudent(
  assessment: AssessmentSummaryDto,
): SupervisorStudentRecord {
  return {
    assessmentId: assessment.id,
    matricNumber: assessment.matricNumber,
    fullName: assessment.studentFullName,
    department: "Assigned department",
    placementCompany: "Placement details not available from assessment record",
    placementAddress: "Placement address not available from assessment record",
    status: assessment.supervisorScore !== null && assessment.supervisorScore !== undefined
      ? "scored"
      : "pending",
  };
}

function mapAssessmentToSubmission(
  assessment: AssessmentSummaryDto,
): SupervisorScoreSubmission | null {
  if (assessment.supervisorScore === null || assessment.supervisorScore === undefined) {
    return null;
  }

  return {
    assessmentId: assessment.id,
    matricNumber: assessment.matricNumber,
    fullName: assessment.studentFullName,
    score: assessment.supervisorScore,
    submittedAt: new Date().toISOString(),
  };
}

export async function getSupervisorStudents(
  params: SupervisorStudentsQueryParams = {},
): Promise<PaginatedSupervisorStudents> {
  const normalizedParams = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 10,
    searchTerm: params.searchTerm?.trim() ?? "",
  };

  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<PaginatedAssessmentResponse>(apiEndpoints.assessment.supervisor, {
      params: normalizedParams,
    });

    const payload = response.data?.data;
    const items = (payload?.items ?? []).map(mapAssessmentToSupervisorStudent);

    return {
      items,
      totalCount: payload?.totalCount ?? items.length,
      pageNumber: payload?.pageNumber ?? normalizedParams.pageNumber,
      pageSize: payload?.pageSize ?? normalizedParams.pageSize,
      totalPages:
        payload?.totalPages ?? Math.max(1, Math.ceil((payload?.totalCount ?? items.length) / normalizedParams.pageSize)),
    };
  }

  await wait(300);

  const submissions = getStoredSubmissions();
  const filteredStudents = mockStudents
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
    .map((student) => ({
      ...student,
      status: submissions.some((item) => item.matricNumber === student.matricNumber)
        ? "scored"
        : student.status,
    }));

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

export async function searchSupervisorStudent(matricNumber: string) {
  if (hasConfiguredApiBaseUrl()) {
    const result = await getSupervisorStudents({
      pageNumber: 1,
      pageSize: 20,
      searchTerm: matricNumber,
    });
    const items = result.items;
    const assessment = items.find(
      (item) => item.matricNumber.toLowerCase() === matricNumber.toLowerCase(),
    );

    return assessment ?? null;
  }

  await wait(450);

  const submissions = getStoredSubmissions();
  const submission = submissions.find((item) => item.matricNumber === matricNumber);
  const student = mockStudents.find(
    (item) => item.matricNumber.toLowerCase() === matricNumber.toLowerCase(),
  );

  if (!student) {
    return null;
  }

  return {
    ...student,
    status: submission ? "scored" : student.status,
  } satisfies SupervisorStudentRecord;
}

export async function getSupervisorSubmissions() {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<PaginatedAssessmentResponse>(apiEndpoints.assessment.supervisor, {
      params: {
        pageNumber: 1,
        pageSize: 50,
      },
    });

    const items = response.data?.data?.items ?? [];
    return items
      .map(mapAssessmentToSubmission)
      .filter((item): item is SupervisorScoreSubmission => Boolean(item));
  }

  await wait(250);
  return getStoredSubmissions();
}

export async function submitSupervisorScore(input: {
  assessmentId: string;
  matricNumber: string;
  score: number;
  note: string;
}) {
  if (hasConfiguredApiBaseUrl()) {
    await apiClient.post<{ message?: string }>(apiEndpoints.assessment.supervisorScore, {
      assessmentId: input.assessmentId,
      score: input.score,
    });

    return {
      message: "Supervisor score saved successfully.",
      submission: {
        assessmentId: input.assessmentId,
        matricNumber: input.matricNumber,
        fullName: "",
        score: input.score,
        submittedAt: new Date().toISOString(),
      } satisfies SupervisorScoreSubmission,
    };
  }

  await wait(800);

  const student = mockStudents.find((item) => item.matricNumber === input.matricNumber);

  if (!student) {
    throw new Error("Student not found.");
  }

  const existing = getStoredSubmissions().filter(
    (item) => item.matricNumber !== input.matricNumber,
  );

  const submission: SupervisorScoreSubmission = {
    assessmentId: input.assessmentId,
    matricNumber: input.matricNumber,
    fullName: student.fullName,
    score: input.score,
    submittedAt: new Date().toISOString(),
  };

  setStoredSubmissions([submission, ...existing]);

  return {
    message: "Supervisor score saved locally. Backend score submission will plug into this service later.",
    submission,
  };
}
