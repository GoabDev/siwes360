import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  StudentProfile,
  UpdateStudentProfilePayload,
} from "@/features/student/types/student-profile";

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

type UploadPhotoApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    publicId: string;
    url: string;
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
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const mockProfile: StudentProfile = {
  id: "mock-student-id",
  email: "johnson.adebayo@example.com",
  fullName: "Johnson Adebayo",
  matricNumber: "CSC/2021/014",
  department: "Computer Science",
  imageUrl: "",
  phoneNumber: "08012345678",
};

function mapUserProfileResponseToStudentProfile(
  payload: NonNullable<UserProfileApiResponse["data"]>,
): StudentProfile {
  return {
    id: payload.id,
    email: payload.email,
    fullName: `${payload.firstname} ${payload.lastname}`.trim(),
    matricNumber: payload.matricNo,
    department: payload.departmentName,
    imageUrl: payload.imageUrl ?? "",
    phoneNumber: "",
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

async function uploadProfilePhoto(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadPhotoApiResponse>(apiEndpoints.photo.upload, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.data?.url ?? "";
}

export async function getStudentProfile(): Promise<StudentProfile> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<UserProfileApiResponse>(apiEndpoints.userProfile.me);

    if (response.data?.data) {
      return mapUserProfileResponseToStudentProfile(response.data.data);
    }

    return mockProfile;
  }

  await wait(700);
  return mockProfile;
}

export async function updateStudentProfile(
  payload: UpdateStudentProfilePayload,
): Promise<{ message: string; profile: StudentProfile }> {
  if (hasConfiguredApiBaseUrl()) {
    const { firstName, lastName } = splitFullName(payload.fullName);
    const imageUrl = payload.imageFile ? await uploadProfilePhoto(payload.imageFile) : payload.imageUrl ?? "";
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
        ...payload,
        fullName: `${updatedFirstName} ${updatedLastName}`.trim(),
        imageUrl: response.data?.data?.imageUrl ?? imageUrl,
      },
    };
  }

  await wait(950);
  return {
    message:
      "Student profile saved locally.",
    profile: {
      ...payload,
      imageUrl: payload.imageFile ? payload.imageUrl ?? "" : payload.imageUrl ?? "",
    },
  };
}
