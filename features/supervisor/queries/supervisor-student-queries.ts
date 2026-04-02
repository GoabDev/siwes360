"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSupervisorStudents,
  getSupervisorSubmissions,
  searchSupervisorStudent,
  submitSupervisorScore,
} from "@/features/supervisor/services/supervisor-student-service";
import type { SupervisorStudentsQueryParams } from "@/features/supervisor/types/supervisor-students";

export const supervisorStudentLookupKey = (matricNumber: string) => [
  "supervisor-student",
  matricNumber,
];
export const supervisorStudentsKey = (params?: SupervisorStudentsQueryParams) => [
  "supervisor-students",
  params,
];
export const supervisorSubmissionsKey = ["supervisor-submissions"];

export function useSupervisorStudentsQuery(params?: SupervisorStudentsQueryParams) {
  return useQuery({
    queryKey: supervisorStudentsKey(params),
    queryFn: () => getSupervisorStudents(params),
  });
}

export function useSupervisorStudentQuery(matricNumber: string) {
  return useQuery({
    queryKey: supervisorStudentLookupKey(matricNumber),
    queryFn: () => searchSupervisorStudent(matricNumber),
    enabled: Boolean(matricNumber),
  });
}

export function useSupervisorSubmissionsQuery() {
  return useQuery({
    queryKey: supervisorSubmissionsKey,
    queryFn: getSupervisorSubmissions,
  });
}

export function useSubmitSupervisorScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitSupervisorScore,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: supervisorSubmissionsKey });
      await queryClient.invalidateQueries({ queryKey: ["supervisor-students"] });
      await queryClient.invalidateQueries({
        queryKey: supervisorStudentLookupKey(variables.matricNumber),
      });
    },
  });
}
