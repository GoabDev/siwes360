import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { StudentProfile } from "@/features/student/types/student-profile";

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const mockProfile: StudentProfile = {
  fullName: "Johnson Adebayo",
  matricNumber: "CSC/2021/014",
  department: "Computer Science",
  phoneNumber: "08012345678",
  placementCompany: "Interswitch",
  placementAddress: "12 Marina Road, Lagos",
  workplaceSupervisorName: "Mrs. Grace Okon",
  startDate: "2026-01-12",
  endDate: "2026-06-12",
  bio: "400-level student currently attached to a fintech product team for SIWES placement.",
};

export async function getStudentProfile(): Promise<StudentProfile> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<StudentProfile>(apiEndpoints.student.profile);
    return response.data;
  }

  await wait(700);
  return mockProfile;
}

export async function updateStudentProfile(
  payload: StudentProfile,
): Promise<{ message: string; profile: StudentProfile }> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.put<{ message: string; profile: StudentProfile }>(
      apiEndpoints.student.profile,
      payload,
    );
    return response.data;
  }

  await wait(950);
  return {
    message: "Student profile saved locally. Live profile persistence will use the backend endpoint when available.",
    profile: payload,
  };
}
