export type StudentProfile = {
  id?: string;
  email?: string;
  fullName: string;
  matricNumber: string;
  department: string;
  imageUrl?: string;
  phoneNumber?: string;
  placementCompany?: string;
  placementAddress?: string;
  workplaceSupervisorName?: string;
  startDate?: string;
  endDate?: string;
  bio?: string;
};

export type UpdateStudentProfilePayload = StudentProfile & {
  imageFile?: File | null;
};
