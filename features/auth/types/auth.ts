export type AuthRole = "student" | "supervisor" | "admin";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type StudentRegisterPayload = {
  role: "student";
  fullName: string;
  email: string;
  matricNumber: string;
  department: string;
  password: string;
  confirmPassword: string;
};

export type SupervisorOnboardingPayload = {
  role: "supervisor";
  fullName: string;
  email: string;
  staffId: string;
  phoneNumber: string;
  organization: string;
  password: string;
  confirmPassword: string;
};

export type RegisterPayload = StudentRegisterPayload | SupervisorOnboardingPayload;

export type ForgotPasswordPayload = {
  email: string;
};

export type AuthResponse = {
  message: string;
  redirectTo?: string;
  role?: AuthRole;
  token?: string;
};
