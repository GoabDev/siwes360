export type Department = {
  id: string;
  name: string;
  adminUserId: string | null;
  createdAt: string;
};

export type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
