export type SupervisorStudentRecord = {
  assessmentId: string;
  matricNumber: string;
  fullName: string;
  department: string;
  placementCompany: string;
  placementAddress: string;
  status: "pending" | "scored";
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
