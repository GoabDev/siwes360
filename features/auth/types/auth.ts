export type AuthRole = "student" | "supervisor" | "admin";

export type LoginPayload = {
  identifier: string;
  password: string;
};

type RegisterPayloadBase = {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  password: string;
  confirmPassword: string;
};

export type StudentRegisterPayload = RegisterPayloadBase & {
  role: "student";
  matricNo: string;
};

export type SupervisorRegisterPayload = RegisterPayloadBase & {
  role: "supervisor";
  matricNo?: string;
};

export type AdminRegisterPayload = RegisterPayloadBase & {
  role: "admin";
  matricNo?: string;
};

export type RegisterPayload =
  | StudentRegisterPayload
  | SupervisorRegisterPayload
  | AdminRegisterPayload;

export type ForgotPasswordPayload = {
  email: string;
};

export type ConfirmEmailPayload = {
  userId: string;
  token: string;
};

export type ResendEmailVerificationPayload = {
  email: string;
};

export type SetPasswordPayload = {
  userId: string;
  token: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  message: string;
  redirectTo?: string;
  role?: AuthRole;
  token?: string;
  refreshToken?: string;
};
