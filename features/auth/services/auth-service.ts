import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth";
import { apiClient } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { hasConfiguredApiBaseUrl } from "@/lib/api/config";
import type { AuthRole } from "@/features/auth/types/auth";

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function inferRoleFromIdentifier(identifier: string): AuthRole {
  const normalizedIdentifier = identifier.toLowerCase();

  if (normalizedIdentifier.includes("admin")) {
    return "admin";
  }

  if (normalizedIdentifier.includes("supervisor")) {
    return "supervisor";
  }

  return "student";
}

function getRoleRedirect(role: AuthRole) {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "supervisor") {
    return "/supervisor";
  }

  return "/student";
}

function getRoleLabel(role: AuthRole) {
  if (role === "admin") {
    return "admin";
  }

  if (role === "supervisor") {
    return "supervisor";
  }

  return "student";
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<AuthResponse>(apiEndpoints.auth.login, payload);
    return response.data;
  }

  await wait(900);
  const role = inferRoleFromIdentifier(payload.identifier);

  return {
    message: `Dummy ${getRoleLabel(role)} session created. Redirecting to the ${getRoleLabel(role)} workspace.`,
    redirectTo: getRoleRedirect(role),
    role,
    token: `mock-token-${role}`,
  };
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<AuthResponse>(apiEndpoints.auth.register, payload);
    return response.data;
  }

  await wait(1100);

  if (payload.role === "student") {
    return {
      message: `Student registration captured for ${payload.matricNumber} in ${payload.department}. Backend student onboarding will plug into this service next.`,
      redirectTo: "/auth/login",
    };
  }

  return {
    message: "Supervisor onboarding details captured. Backend access rules can replace this temporary flow later.",
    redirectTo: "/auth/login",
  };
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload,
): Promise<AuthResponse> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<AuthResponse>(
      apiEndpoints.auth.forgotPassword,
      payload,
    );
    return response.data;
  }

  await wait(800);

  return {
    message: `Reset instructions would be sent to ${payload.email} once backend recovery is connected.`,
  };
}
