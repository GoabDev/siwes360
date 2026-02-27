export type StudentReportStatus =
  | "not_uploaded"
  | "uploaded"
  | "format_check"
  | "ai_review"
  | "graded";

export type StudentReportRecord = {
  title: string;
  fileName: string;
  fileSize: number;
  summary: string;
  submittedAt: string;
  status: StudentReportStatus;
  reportScore?: number | null;
};

export type StudentReportUploadPayload = {
  title: string;
  summary: string;
  file: File;
};
