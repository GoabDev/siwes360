"use client";

import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/features/auth/services/department-service";

export const departmentQueryKey = ["departments"];

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: departmentQueryKey,
    queryFn: getDepartments,
  });
}
