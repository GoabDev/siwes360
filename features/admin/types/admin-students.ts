export type AdminStudentRecord = {
  studentId: string | null;
  assessmentId: string | null;
  matricNumber: string;
  fullName: string;
  email: string;
  department: string;
  documentSubmissionId: string | null;
  documentValidationScore: number | null;
  reportScore: number | null;
  supervisorScore: number | null;
  supervisorId: string | null;
  supervisorFullName: string | null;
  supervisorScoredAt: string | null;
  logbookScore: number | null;
  presentationScore: number | null;
  adminId: string | null;
  adminFullName: string | null;
  adminScoredAt: string | null;
  totalScore: number | null;
  status: "incomplete" | "ready" | "complete";
  isFinalized: boolean;
  grade: string | null;
  finalizedAt: string | null;
  createdAt: string | null;
};

export type AdminStudentsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
};

export type PaginatedAdminStudents = {
  items: AdminStudentRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminScoreRecord = {
  assessmentId?: string;
  matricNumber: string;
  logbookScore: number;
  presentationScore: number;
  updatedAt: string;
};
