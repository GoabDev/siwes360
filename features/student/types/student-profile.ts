export type StudentProfile = {
  id?: string;
  email?: string;
  fullName: string;
  matricNumber: string;
  department: string;
  imageUrl?: string;
  phoneNumber?: string;
};

export type UpdateStudentProfilePayload = StudentProfile & {
  imageFile?: File | null;
};
