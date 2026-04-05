export type StudentScoreBreakdown = {
  validation: number | null;
  report: number | null;
  supervisor: number | null;
  logbook: number | null;
  presentation: number | null;
  total: number | null;
  grade: string | null;
  isFinalized: boolean;
  status: "incomplete" | "complete";
};
