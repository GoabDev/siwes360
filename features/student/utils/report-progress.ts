import type { StudentReportRecord, StudentReportStatus } from "@/features/student/types/student-report";

function getElapsedSeconds(submittedAt: string) {
  return Math.floor((Date.now() - new Date(submittedAt).getTime()) / 1000);
}

export function getDerivedReportStatus(submittedAt: string): StudentReportStatus {
  const elapsedSeconds = getElapsedSeconds(submittedAt);

  if (elapsedSeconds >= 45) {
    return "graded";
  }

  if (elapsedSeconds >= 25) {
    return "ai_review";
  }

  if (elapsedSeconds >= 10) {
    return "format_check";
  }

  return "uploaded";
}

export function withDerivedReportProgress(report: StudentReportRecord): StudentReportRecord {
  const status = getDerivedReportStatus(report.submittedAt);
  const reportScore = status === "graded" ? 24 : null;

  return {
    ...report,
    status,
    reportScore,
  };
}
