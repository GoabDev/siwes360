"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentProfile,
  updateStudentProfile,
} from "@/features/student/services/student-profile-service";
import type { StudentProfile } from "@/features/student/types/student-profile";

export const studentProfileQueryKey = ["student-profile"];

export function useStudentProfileQuery() {
  return useQuery({
    queryKey: studentProfileQueryKey,
    queryFn: getStudentProfile,
  });
}

export function useUpdateStudentProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: (data) => {
      queryClient.setQueryData<StudentProfile>(studentProfileQueryKey, data.profile);
    },
  });
}
