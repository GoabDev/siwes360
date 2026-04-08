"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentWorkflowProgress } from "@/features/student/services/student-workflow-service";

export const studentWorkflowKey = ["student-workflow"];

export function useStudentWorkflowQuery() {
  return useQuery({
    queryKey: studentWorkflowKey,
    queryFn: getStudentWorkflowProgress,
  });
}
