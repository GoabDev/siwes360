export type StudentScoreBreakdown = {
  report: number | null;
  supervisor: number | null;
  logbook: number | null;
  presentation: number | null;
  total: number | null;
  status: "incomplete" | "complete";
};
