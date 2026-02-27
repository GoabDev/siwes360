export type AuthRole = "student" | "supervisor" | "admin";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: AuthRole;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type AuthResponse = {
  message: string;
  redirectTo?: string;
  role?: AuthRole;
  token?: string;
};
