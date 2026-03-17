export type AdminSupervisorRecord = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  department: string;
  imageUrl?: string;
};

export type AdminSupervisorsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
};

export type PaginatedAdminSupervisors = {
  items: AdminSupervisorRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type InviteSupervisorPayload = {
  fullName: string;
  email: string;
  departmentId: string;
};
