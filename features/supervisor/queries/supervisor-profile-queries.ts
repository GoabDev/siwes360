"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSupervisorProfile,
  updateSupervisorProfile,
} from "@/features/supervisor/services/supervisor-profile-service";
import type { SupervisorProfile } from "@/features/supervisor/types/supervisor-profile";

export const supervisorProfileQueryKey = ["supervisor-profile"];

export function useSupervisorProfileQuery() {
  return useQuery({
    queryKey: supervisorProfileQueryKey,
    queryFn: getSupervisorProfile,
  });
}

export function useUpdateSupervisorProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupervisorProfile,
    onSuccess: (data) => {
      queryClient.setQueryData<SupervisorProfile>(supervisorProfileQueryKey, data.profile);
    },
  });
}
