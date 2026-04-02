export type DocumentValidationStatus =
  | "Uploaded"
  | "Processing"
  | "Queued"
  | "Validating"
  | "Passed"
  | "Completed"
  | "Failed";

export type StudentDocumentUploadPayload = {
  file: File;
};

export type StudentDocumentUploadResult = {
  submissionId: string;
  message: string;
};

export type StudentDocumentTimelineEvent = {
  status: string;
  occurredAt: string;
  description: string;
};

export type StudentDocumentStatus = {
  submissionId: string;
  fileName: string;
  currentStatus: DocumentValidationStatus;
  timeline: StudentDocumentTimelineEvent[];
};

export type ValidationRuleSeverity = "Pass" | "Warning" | "Fail";

export type StudentValidationRuleResult = {
  ruleId: string;
  title: string;
  severity: ValidationRuleSeverity;
  weight: number;
  details: string;
};

export type StudentValidationReport = {
  submissionId: string;
  fileName: string;
  status: DocumentValidationStatus;
  score: number | null;
  validatedAt: string | null;
  results: StudentValidationRuleResult[];
};
