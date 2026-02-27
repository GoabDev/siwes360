"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentScores } from "@/features/student/services/student-scores-service";

export const studentScoresKey = ["student-scores"];

export function useStudentScoresQuery() {
  return useQuery({
    queryKey: studentScoresKey,
    queryFn: getStudentScores,
  });
}
