import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { AdminProfile } from "@/features/admin/types/admin-profile";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockProfile: AdminProfile = {
  fullName: "Mrs. Ngozi Eze",
  email: "admin@example.com",
  staffId: "ADM-3301",
  department: "Computer Science",
  officePhone: "08123456789",
  roleTitle: "Department SIWES Admin",
  bio: "Department administrator coordinating logbook, presentation, and final grading completion.",
};

export async function getAdminProfile(): Promise<AdminProfile> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<AdminProfile>(apiEndpoints.admin.profile);
    return response.data;
  }

  await wait(650);
  return mockProfile;
}

export async function updateAdminProfile(
  payload: AdminProfile,
): Promise<{ message: string; profile: AdminProfile }> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.put<{ message: string; profile: AdminProfile }>(
      apiEndpoints.admin.profile,
      payload,
    );
    return response.data;
  }

  await wait(900);
  return {
    message: "Admin profile saved locally. Backend wiring can replace this service later.",
    profile: payload,
  };
}
