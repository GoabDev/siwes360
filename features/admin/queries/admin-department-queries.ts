"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  deleteDepartment,
  getAdminDepartmentById,
  getAdminDepartments,
  updateDepartment,
} from "@/features/admin/services/admin-department-service";
import type { DepartmentFormPayload } from "@/features/admin/types/admin-departments";

export const adminDepartmentsKey = ["admin-departments"];
export const adminDepartmentKey = (id: string) => ["admin-department", id];

export function useAdminDepartmentsQuery(enabled = true) {
  return useQuery({
    queryKey: adminDepartmentsKey,
    queryFn: getAdminDepartments,
    enabled,
  });
}

export function useAdminDepartmentQuery(id: string) {
  return useQuery({
    queryKey: adminDepartmentKey(id),
    queryFn: () => getAdminDepartmentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminDepartmentsKey });
    },
  });
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DepartmentFormPayload }) =>
      updateDepartment(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: adminDepartmentsKey });
      await queryClient.invalidateQueries({ queryKey: adminDepartmentKey(variables.id) });
    },
  });
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminDepartmentsKey });
    },
  });
}
