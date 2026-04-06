import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  AdminProfile,
  UpdateAdminProfilePayload,
} from "@/features/admin/types/admin-profile";

type UserProfileApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    matricNo: string;
    imageUrl?: string | null;
    role: string;
    departmentName: string;
  } | null;
};

type UpdateUserProfileApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    firstname?: string;
    lastname?: string;
    imageUrl?: string | null;
  } | null;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockProfile: AdminProfile = {
  id: "mock-admin-id",
  fullName: "Mrs. Ngozi Eze",
  email: "admin@example.com",
  imageUrl: "",
  department: "Computer Science",
};

function mapUserProfileResponseToAdminProfile(
  payload: NonNullable<UserProfileApiResponse["data"]>,
): AdminProfile {
  return {
    id: payload.id,
    fullName: `${payload.firstname} ${payload.lastname}`.trim(),
    email: payload.email,
    imageUrl: payload.imageUrl ?? "",
    department: payload.departmentName,
  };
}

function splitFullName(fullName: string) {
  const normalized = fullName.trim().replace(/\s+/g, " ");
  const [firstName = "", ...rest] = normalized.split(" ");

  return {
    firstName,
    lastName: rest.join(" ").trim(),
  };
}

export async function getAdminProfile(): Promise<AdminProfile> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<UserProfileApiResponse>(apiEndpoints.userProfile.me);

    if (response.data?.data) {
      return mapUserProfileResponseToAdminProfile(response.data.data);
    }

    return mockProfile;
  }

  await wait(650);
  return mockProfile;
}

export async function updateAdminProfile(
  payload: UpdateAdminProfilePayload,
): Promise<{ message: string; profile: AdminProfile }> {
  const profilePayload: AdminProfile = {
    id: payload.id,
    fullName: payload.fullName,
    email: payload.email,
    imageUrl: payload.imageUrl,
    department: payload.department,
  };

  if (hasConfiguredApiBaseUrl()) {
    const { firstName, lastName } = splitFullName(payload.fullName);
    const formData = new FormData();

    formData.append("Firstname", firstName);
    formData.append("Lastname", lastName);

    if (payload.imageFile) {
      formData.append("Image", payload.imageFile);
    }

    const response = await apiClient.put<UpdateUserProfileApiResponse>(
      apiEndpoints.userProfile.me,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const updatedFirstName = response.data?.data?.firstname ?? firstName;
    const updatedLastName = response.data?.data?.lastname ?? lastName;

    return {
      message: response.data?.message?.trim() || "Profile updated successfully.",
      profile: {
        ...profilePayload,
        fullName: `${updatedFirstName} ${updatedLastName}`.trim(),
        imageUrl: response.data?.data?.imageUrl ?? payload.imageUrl ?? "",
      },
    };
  }

  await wait(900);
  return {
    message: "Admin profile saved locally.",
    profile: profilePayload,
  };
}
