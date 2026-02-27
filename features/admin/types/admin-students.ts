export type AdminStudentRecord = {
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

export type AdminScoreRecord = {
  matricNumber: string;
  logbookScore: number;
  presentationScore: number;
  updatedAt: string;
};
