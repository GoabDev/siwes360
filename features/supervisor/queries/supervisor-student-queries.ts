"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSupervisorSubmissions,
  searchSupervisorStudent,
  submitSupervisorScore,
} from "@/features/supervisor/services/supervisor-student-service";
import type {
  SupervisorScoreSubmission,
  SupervisorStudentRecord,
} from "@/features/supervisor/types/supervisor-students";

export const supervisorStudentLookupKey = (matricNumber: string) => [
  "supervisor-student",
  matricNumber,
];
export const supervisorSubmissionsKey = ["supervisor-submissions"];

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
    onSuccess: (data) => {
      queryClient.setQueryData<SupervisorScoreSubmission[]>(
        supervisorSubmissionsKey,
        (current = []) => [data.submission, ...current.filter((item) => item.matricNumber !== data.submission.matricNumber)],
      );
      queryClient.setQueryData<SupervisorStudentRecord | null>(
        supervisorStudentLookupKey(data.submission.matricNumber),
        (current) =>
          current
            ? {
                ...current,
                status: "scored",
              }
            : current,
      );
    },
  });
}
