import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiListResponse, Department } from "@/features/auth/types/department";

export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<ApiListResponse<Department[]>>(apiEndpoints.department.all);
  return response.data.data;
}
