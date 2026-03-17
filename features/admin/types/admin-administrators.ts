export type AdminAdministratorRecord = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  department: string;
  imageUrl?: string;
};

export type AdminAdministratorsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
};

export type PaginatedAdminAdministrators = {
  items: AdminAdministratorRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
