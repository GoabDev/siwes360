"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSupervisor,
  getAdminSupervisors,
  inviteSupervisor,
} from "@/features/admin/services/admin-supervisor-service";
import type { AdminSupervisorsQueryParams } from "@/features/admin/types/admin-supervisors";

export const adminSupervisorsKey = (params?: AdminSupervisorsQueryParams) => [
  "admin-supervisors",
  params,
];

export function useAdminSupervisorsQuery(params?: AdminSupervisorsQueryParams) {
  return useQuery({
    queryKey: adminSupervisorsKey(params),
    queryFn: () => getAdminSupervisors(params),
  });
}

export function useInviteSupervisorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteSupervisor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-supervisors"] });
    },
  });
}

export function useDeleteSupervisorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupervisor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-supervisors"] });
    },
  });
}
