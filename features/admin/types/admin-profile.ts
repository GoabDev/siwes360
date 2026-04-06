export type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string;
  department: string;
};

export type UpdateAdminProfilePayload = AdminProfile & {
  imageFile?: File | null;
};
