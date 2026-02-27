"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProfile,
  updateAdminProfile,
} from "@/features/admin/services/admin-profile-service";
import type { AdminProfile } from "@/features/admin/types/admin-profile";

export const adminProfileQueryKey = ["admin-profile"];

export function useAdminProfileQuery() {
  return useQuery({
    queryKey: adminProfileQueryKey,
    queryFn: getAdminProfile,
  });
}

export function useUpdateAdminProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: (data) => {
      queryClient.setQueryData<AdminProfile>(adminProfileQueryKey, data.profile);
    },
  });
}
