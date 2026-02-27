import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { SupervisorProfile } from "@/features/supervisor/types/supervisor-profile";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockProfile: SupervisorProfile = {
  fullName: "Dr. Amina Yusuf",
  staffId: "SUP-1042",
  email: "supervisor@example.com",
  phoneNumber: "08098765432",
  department: "Computer Science",
  organization: "School of Computing",
  bio: "Academic supervisor responsible for workplace assessment and SIWES evaluation follow-up.",
};

export async function getSupervisorProfile(): Promise<SupervisorProfile> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<SupervisorProfile>(apiEndpoints.supervisor.profile);
    return response.data;
  }

  await wait(650);
  return mockProfile;
}

export async function updateSupervisorProfile(
  payload: SupervisorProfile,
): Promise<{ message: string; profile: SupervisorProfile }> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.put<{ message: string; profile: SupervisorProfile }>(
      apiEndpoints.supervisor.profile,
      payload,
    );
    return response.data;
  }

  await wait(900);
  return {
    message: "Supervisor profile saved locally. Live persistence will plug into the backend later.",
    profile: payload,
  };
}
