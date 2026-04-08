export type StudentWorkflowStep = {
  key: string;
  label: string;
  status: string;
  isDone: boolean;
};

export type StudentWorkflowProgress = {
  studentId: string;
  studentFullName: string;
  steps: StudentWorkflowStep[];
};
