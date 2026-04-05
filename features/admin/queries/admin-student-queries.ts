"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  finalizeAssessment,
  getAdminStudentByMatric,
  getAdminStudents,
  unfinalizeAssessment,
  submitAdminScores,
} from "@/features/admin/services/admin-student-service";
import type { AdminStudentsQueryParams } from "@/features/admin/types/admin-students";

export const adminStudentsKey = (params?: AdminStudentsQueryParams) => ["admin-students", params];
export const adminStudentKey = (matricNumber: string) => ["admin-student", matricNumber];

export function useAdminStudentsQuery(params?: AdminStudentsQueryParams) {
  return useQuery({
    queryKey: adminStudentsKey(params),
    queryFn: () => getAdminStudents(params),
  });
}

export function useAdminStudentQuery(matricNumber: string) {
  return useQuery({
    queryKey: adminStudentKey(matricNumber),
    queryFn: () => getAdminStudentByMatric(matricNumber),
    enabled: Boolean(matricNumber),
  });
}

export function useSubmitAdminScoresMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAdminScores,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      await queryClient.invalidateQueries({ queryKey: adminStudentKey(variables.matricNumber) });
    },
  });
}

export function useFinalizeAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeAssessment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-student"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-finalize-preview"] });
    },
  });
}

export function useUnfinalizeAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfinalizeAssessment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-student"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-finalize-preview"] });
    },
  });
}
