export type AdminDepartmentRecord = {
  id: string;
  name: string;
  adminUserId: string | null;
  adminEmail?: string;
  createdAt?: string;
};

export type DepartmentFormPayload = {
  name: string;
  adminUserId: string;
};
