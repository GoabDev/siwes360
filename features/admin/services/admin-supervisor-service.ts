"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  AdminSupervisorRecord,
  AdminSupervisorsQueryParams,
  InviteSupervisorPayload,
  PaginatedAdminSupervisors,
} from "@/features/admin/types/admin-supervisors";

type SupervisorApiRecord = {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  imageUrl?: string | null;
  departmentName?: string;
};

type PaginatedSupervisorData =
  | SupervisorApiRecord[]
  | {
      items?: SupervisorApiRecord[];
      results?: SupervisorApiRecord[];
      data?: SupervisorApiRecord[];
      pageNumber?: number;
      currentPage?: number;
      pageSize?: number;
      totalCount?: number;
      totalItems?: number;
      totalPages?: number;
      hasPreviousPage?: boolean;
      hasNextPage?: boolean;
    };

type Envelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type PaginatedSupervisorObject = Exclude<PaginatedSupervisorData, SupervisorApiRecord[]>;

const mockSupervisors: AdminSupervisorRecord[] = [
  {
    id: "mock-supervisor-1",
    firstName: "Odufowokan",
    lastName: "Ayotomiwa",
    fullName: "Odufowokan Ayotomiwa",
    email: "tomiwatomzy66@gmail.com",
    department: "Biomedical Engineering",
    imageUrl: "",
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapSupervisor(record: SupervisorApiRecord): AdminSupervisorRecord {
  const firstName = record.firstname?.trim() ?? "";
  const lastName = record.lastname?.trim() ?? "";

  return {
    id: record.id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim() || "Unnamed supervisor",
    email: record.email ?? "",
    department: record.departmentName ?? "Unknown department",
    imageUrl: record.imageUrl ?? "",
  };
}

function parsePaginatedSupervisors(
  payload: Envelope<PaginatedSupervisorData> | PaginatedSupervisorData,
  fallbackParams: Required<Pick<AdminSupervisorsQueryParams, "pageNumber" | "pageSize">>,
): PaginatedAdminSupervisors {
  const rawData =
    typeof payload === "object" && payload !== null && "data" in payload
      ? payload.data
      : payload;
  const meta =
    rawData && !Array.isArray(rawData) ? (rawData as PaginatedSupervisorObject) : undefined;
  const container =
    Array.isArray(rawData) || !rawData
      ? rawData
      : meta?.items ?? meta?.results ?? meta?.data ?? [];
  const items = (Array.isArray(container) ? container : []).map(mapSupervisor);
  const totalCount = meta?.totalCount ?? meta?.totalItems ?? items.length;
  const pageSize = meta?.pageSize ?? fallbackParams.pageSize;
  const pageNumber = meta?.pageNumber ?? meta?.currentPage ?? fallbackParams.pageNumber;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items,
    totalCount,
    pageSize,
    pageNumber,
    totalPages,
    hasPreviousPage: meta?.hasPreviousPage ?? pageNumber > 1,
    hasNextPage: meta?.hasNextPage ?? pageNumber < totalPages,
  };
}

export async function getAdminSupervisors(
  params: AdminSupervisorsQueryParams = {},
): Promise<PaginatedAdminSupervisors> {
  const normalizedParams = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 10,
    searchTerm: params.searchTerm?.trim() ?? "",
    scope: params.scope ?? "department",
    departmentId: params.departmentId ?? null,
  };

  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<Envelope<PaginatedSupervisorData>>(apiEndpoints.userProfile.supervisors, {
      params: {
        pageNumber: normalizedParams.pageNumber,
        pageSize: normalizedParams.pageSize,
        searchTerm: normalizedParams.searchTerm,
      },
    });

    return parsePaginatedSupervisors(response.data, normalizedParams);
  }

  await wait(450);

  const filtered = mockSupervisors.filter((item) => {
    if (!normalizedParams.searchTerm) {
      return true;
    }

    const term = normalizedParams.searchTerm.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.department.toLowerCase().includes(term)
    );
  });
  const startIndex = (normalizedParams.pageNumber - 1) * normalizedParams.pageSize;
  const items = filtered.slice(startIndex, startIndex + normalizedParams.pageSize);

  return {
    items,
    pageNumber: normalizedParams.pageNumber,
    pageSize: normalizedParams.pageSize,
    totalCount: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / normalizedParams.pageSize)),
    hasPreviousPage: normalizedParams.pageNumber > 1,
    hasNextPage: startIndex + normalizedParams.pageSize < filtered.length,
  };
}

export async function inviteSupervisor(payload: InviteSupervisorPayload) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<Envelope<unknown>>(
      apiEndpoints.auth.inviteSupervisor,
      payload,
    );

    return {
      message: response.data?.message?.trim() || "Supervisor invitation sent successfully.",
    };
  }

  await wait(500);
  return {
    message: `Supervisor invitation prepared for ${payload.email}.`,
  };
}

export async function deleteSupervisor(userId: string) {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.delete<Envelope<unknown>>(
      `${apiEndpoints.userProfile.supervisors}/${encodeURIComponent(userId)}`,
    );

    return {
      message: response.data?.message?.trim() || "Supervisor deleted successfully.",
    };
  }

  await wait(400);
  return {
    message: "Supervisor removed from local mock data.",
  };
}
