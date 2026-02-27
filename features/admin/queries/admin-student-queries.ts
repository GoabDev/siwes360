"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStudentByMatric,
  getAdminStudents,
  submitAdminScores,
} from "@/features/admin/services/admin-student-service";

export const adminStudentsKey = ["admin-students"];
export const adminStudentKey = (matricNumber: string) => ["admin-student", matricNumber];

export function useAdminStudentsQuery() {
  return useQuery({
    queryKey: adminStudentsKey,
    queryFn: getAdminStudents,
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
      await queryClient.invalidateQueries({ queryKey: adminStudentsKey });
      await queryClient.invalidateQueries({ queryKey: adminStudentKey(variables.matricNumber) });
    },
  });
}
