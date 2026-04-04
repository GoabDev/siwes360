export type AdminStudentRecord = {
  assessmentId: string | null;
  matricNumber: string;
  fullName: string;
  department: string;
  reportScore: number | null;
  supervisorScore: number | null;
  logbookScore: number | null;
  presentationScore: number | null;
  totalScore: number | null;
  status: "incomplete" | "ready" | "complete";
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
