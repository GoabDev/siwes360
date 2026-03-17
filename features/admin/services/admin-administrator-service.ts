"use client";

import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type {
  AdminAdministratorRecord,
  AdminAdministratorsQueryParams,
  PaginatedAdminAdministrators,
} from "@/features/admin/types/admin-administrators";

type AdministratorApiRecord = {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  imageUrl?: string | null;
  departmentName?: string;
};

type PaginatedAdministratorData =
  | AdministratorApiRecord[]
  | {
      items?: AdministratorApiRecord[];
      results?: AdministratorApiRecord[];
      data?: AdministratorApiRecord[];
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

type PaginatedAdministratorObject = Exclude<
  PaginatedAdministratorData,
  AdministratorApiRecord[]
>;

const mockAdministrators: AdminAdministratorRecord[] = [
  {
    id: "mock-admin-1",
    firstName: "",
    lastName: "",
    fullName: "Civil Engineering Administrator",
    email: "civil-admin@school.com",
    department: "Civil Engineering",
    imageUrl: "",
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapAdministrator(record: AdministratorApiRecord): AdminAdministratorRecord {
  const firstName = record.firstname?.trim() ?? "";
  const lastName = record.lastname?.trim() ?? "";
  const fullName =
    `${firstName} ${lastName}`.trim() || `${record.departmentName ?? "Department"} Administrator`;

  return {
    id: record.id,
    firstName,
    lastName,
    fullName,
    email: record.email ?? "",
    department: record.departmentName ?? "Unknown department",
    imageUrl: record.imageUrl ?? "",
  };
}

function parsePaginatedAdministrators(
  payload: Envelope<PaginatedAdministratorData> | PaginatedAdministratorData,
  fallbackParams: Required<Pick<AdminAdministratorsQueryParams, "pageNumber" | "pageSize">>,
): PaginatedAdminAdministrators {
  const rawData =
    typeof payload === "object" && payload !== null && "data" in payload
      ? payload.data
      : payload;
  const meta =
    rawData && !Array.isArray(rawData) ? (rawData as PaginatedAdministratorObject) : undefined;
  const container =
    Array.isArray(rawData) || !rawData
      ? rawData
      : meta?.items ?? meta?.results ?? meta?.data ?? [];
  const items = (Array.isArray(container) ? container : []).map(mapAdministrator);
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

export async function getAdminAdministrators(
  params: AdminAdministratorsQueryParams = {},
): Promise<PaginatedAdminAdministrators> {
  const normalizedParams = {
    pageNumber: params.pageNumber ?? 1,
    pageSize: params.pageSize ?? 10,
    searchTerm: params.searchTerm?.trim() ?? "",
  };

  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.get<Envelope<PaginatedAdministratorData>>(
      apiEndpoints.userProfile.administrators,
      { params: normalizedParams },
    );

    return parsePaginatedAdministrators(response.data, normalizedParams);
  }

  await wait(450);

  const filtered = mockAdministrators.filter((item) => {
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
