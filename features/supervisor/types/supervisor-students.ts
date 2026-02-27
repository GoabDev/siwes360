export type SupervisorStudentRecord = {
  matricNumber: string;
  fullName: string;
  department: string;
  placementCompany: string;
  placementAddress: string;
  status: "pending" | "scored";
};

export type SupervisorScoreSubmission = {
  matricNumber: string;
  fullName: string;
  score: number;
  submittedAt: string;
};
