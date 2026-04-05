export type SupervisorStudentRecord = {
  assessmentId: string;
  matricNumber: string;
  fullName: string;
  email: string;
  department: string;
  documentSubmissionId: string | null;
  documentValidationScore: number | null;
  reportScore: number | null;
  supervisorScore: number | null;
  logbookScore: number | null;
  presentationScore: number | null;
  totalScore: number;
  grade: string | null;
  isComplete: boolean;
  isFinalized: boolean;
  createdAt: string | null;
  status: "pending" | "scored" | "finalized";
};

export type SupervisorStudentsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
};

export type PaginatedSupervisorStudents = {
  items: SupervisorStudentRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type SupervisorScoreSubmission = {
  assessmentId?: string;
  matricNumber: string;
  fullName: string;
  score: number;
  submittedAt: string;
};
