"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  SupervisorScoreSubmission,
  SupervisorStudentRecord,
} from "@/features/supervisor/types/supervisor-students";

const SUBMISSIONS_STORAGE_KEY = "siwes360-supervisor-submissions";

const mockStudents: SupervisorStudentRecord[] = [
  {
    matricNumber: "CSC/2021/014",
    fullName: "Johnson Adebayo",
    department: "Computer Science",
    placementCompany: "Interswitch",
    placementAddress: "12 Marina Road, Lagos",
    status: "pending",
  },
  {
    matricNumber: "IFT/2021/009",
    fullName: "Mariam Sani",
    department: "Information Technology",
    placementCompany: "MainOne",
    placementAddress: "Plot 5 Adeola Odeku, Victoria Island",
    status: "pending",
  },
];

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

export async function searchSupervisorStudent(matricNumber: string) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<SupervisorStudentRecord>(
      `${apiEndpoints.supervisor.profile}/students/${encodeURIComponent(matricNumber)}`,
    );
    return response.data;
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
    const response = await apiClient.get<SupervisorScoreSubmission[]>(
      `${apiEndpoints.supervisor.profile}/submissions`,
    );
    return response.data;
  }

  await wait(250);
  return getStoredSubmissions();
}

export async function submitSupervisorScore(input: {
  matricNumber: string;
  score: number;
  note: string;
}) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<{
      message: string;
      submission: SupervisorScoreSubmission;
    }>(`${apiEndpoints.supervisor.profile}/scores`, input);
    return response.data;
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
