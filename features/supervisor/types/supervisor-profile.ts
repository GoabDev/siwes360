export type SupervisorProfile = {
  id?: string;
  fullName: string;
  email?: string;
  imageUrl?: string;
  department: string;
};

export type UpdateSupervisorProfilePayload = SupervisorProfile & {
  imageFile?: File | null;
};
