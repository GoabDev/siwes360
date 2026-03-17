"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { Department, ApiListResponse } from "@/features/auth/types/department";
import type {
  AdminAdministratorRecord,
} from "@/features/admin/types/admin-administrators";
import type {
  AdminDepartmentRecord,
  DepartmentFormPayload,
} from "@/features/admin/types/admin-departments";

type Envelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

const mockDepartments: AdminDepartmentRecord[] = [
  {
    id: "mock-dept-1",
    name: "Computer Science",
    adminUserId: "mock-admin-1",
    adminEmail: "cs-admin@school.com",
    createdAt: new Date().toISOString(),
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapDepartment(
  department: Department,
  administrators: AdminAdministratorRecord[] = [],
): AdminDepartmentRecord {
  const admin = administrators.find((item) => item.id === department.adminUserId);

  return {
    id: department.id,
    name: department.name,
    adminUserId: department.adminUserId,
    adminEmail: admin?.email,
    createdAt: department.createdAt,
  };
}

async function getAdministratorsForDepartmentMapping() {
  if (!hasConfiguredApiBaseUrl()) {
    return [] as AdminAdministratorRecord[];
  }

  const response = await apiClient.get<
    Envelope<{
      items?: Array<{
        id: string;
        firstname?: string;
        lastname?: string;
        email?: string;
        departmentName?: string;
        imageUrl?: string | null;
      }>;
    }>
  >(apiEndpoints.userProfile.administrators, {
    params: {
      pageNumber: 1,
      pageSize: 100,
      searchTerm: "",
    },
  });

  return (response.data?.data?.items ?? []).map((item) => ({
    id: item.id,
    firstName: item.firstname?.trim() ?? "",
    lastName: item.lastname?.trim() ?? "",
    fullName:
      `${item.firstname?.trim() ?? ""} ${item.lastname?.trim() ?? ""}`.trim() ||
      `${item.departmentName ?? "Department"} Administrator`,
    email: item.email ?? "",
    department: item.departmentName ?? "Unknown department",
    imageUrl: item.imageUrl ?? "",
  }));
}

export async function getAdminDepartments(): Promise<AdminDepartmentRecord[]> {
  if (hasConfiguredApiBaseUrl()) {
    const [departmentsResponse, administrators] = await Promise.all([
      apiClient.get<ApiListResponse<Department[]>>(apiEndpoints.department.all),
      getAdministratorsForDepartmentMapping(),
    ]);

    return departmentsResponse.data.data.map((item) => mapDepartment(item, administrators));
  }

  await wait(350);
  return mockDepartments;
}

export async function getAdminDepartmentById(id: string): Promise<AdminDepartmentRecord | null> {
  if (hasConfiguredApiBaseUrl()) {
    const [response, administrators] = await Promise.all([
      apiClient.get<Envelope<Department>>(`${apiEndpoints.department.root}/${encodeURIComponent(id)}`),
      getAdministratorsForDepartmentMapping(),
    ]);

    if (!response.data?.data) {
      return null;
    }

    return mapDepartment(response.data.data, administrators);
  }

  await wait(200);
  return mockDepartments.find((item) => item.id === id) ?? null;
}

export async function createDepartment(payload: DepartmentFormPayload) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<Envelope<unknown>>(apiEndpoints.department.root, payload);
    return {
      message: response.data?.message?.trim() || "Department created successfully.",
    };
  }

  await wait(300);
  return {
    message: "Department created locally.",
  };
}

export async function updateDepartment(id: string, payload: DepartmentFormPayload) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.put<Envelope<unknown>>(
      `${apiEndpoints.department.root}/${encodeURIComponent(id)}`,
      payload,
    );
    return {
      message: response.data?.message?.trim() || "Department updated successfully.",
    };
  }

  await wait(300);
  return {
    message: "Department updated locally.",
  };
}

export async function deleteDepartment(id: string) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.delete<Envelope<unknown>>(
      `${apiEndpoints.department.root}/${encodeURIComponent(id)}`,
    );
    return {
      message: response.data?.message?.trim() || "Department deleted successfully.",
    };
  }

  await wait(250);
  return {
    message: "Department deleted locally.",
  };
}
