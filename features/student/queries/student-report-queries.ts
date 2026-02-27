"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentReport,
  uploadStudentReport,
} from "@/features/student/services/student-report-service";
import type { StudentReportRecord } from "@/features/student/types/student-report";

export const studentReportQueryKey = ["student-report"];

export function useStudentReportQuery() {
  return useQuery({
    queryKey: studentReportQueryKey,
    queryFn: getStudentReport,
  });
}

export function useUploadStudentReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadStudentReport,
    onSuccess: (data) => {
      queryClient.setQueryData<StudentReportRecord>(studentReportQueryKey, data.report);
    },
  });
}
