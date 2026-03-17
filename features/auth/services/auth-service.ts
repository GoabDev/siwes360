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
import { getRoleHome } from "@/lib/auth/session-config";
import {
  getRoleFromAccessToken,
  normalizeBackendRole,
} from "@/features/auth/utils/jwt-auth";

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

function getRoleLabel(role: AuthRole) {
  if (role === "admin") {
    return "admin";
  }

  if (role === "supervisor") {
    return "supervisor";
  }

  return "student";
}

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type LoginApiPayload = {
  message?: string;
  role?: AuthRole | string | number | null;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
};

function normalizeNumericOrStringRole(
  role: AuthRole | string | number | null | undefined,
): AuthRole | undefined {
  if (typeof role === "string") {
    return normalizeBackendRole(role);
  }

  if (role === 1) {
    return "student";
  }

  if (role === 2) {
    return "admin";
  }

  if (role === 3) {
    return "supervisor";
  }

  return undefined;
}

function mapRoleToApiValue(role: RegisterPayload["role"]) {
  if (role === "student") {
    return 1;
  }

  if (role === "admin") {
    return 2;
  }

  return 3;
}

function unwrapEnvelope<T>(payload: T | ApiEnvelope<T>): { message?: string; data: T | undefined } {
  if (typeof payload === "object" && payload !== null && ("data" in payload || "message" in payload)) {
    const envelope = payload as ApiEnvelope<T>;
    return {
      message: envelope.message,
      data: envelope.data,
    };
  }

  return {
    data: payload as T,
  };
}

function getFallbackMessage(...candidates: Array<string | null | undefined>) {
  return candidates.find((candidate) => typeof candidate === "string" && candidate.trim())?.trim();
}

function mapRegisterPayload(payload: RegisterPayload) {
  return {
    firstname: payload.firstName.trim(),
    lastname: payload.lastName.trim(),
    matricNo: payload.role === "student" ? payload.matricNo.trim() : payload.matricNo?.trim() || "",
    email: payload.email.trim(),
    password: payload.password,
    role: mapRoleToApiValue(payload.role),
    departmentId: payload.departmentId,
  };
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<ApiEnvelope<LoginApiPayload> | LoginApiPayload>(
      apiEndpoints.auth.login,
      payload,
    );
    const { message, data } = unwrapEnvelope<LoginApiPayload>(response.data);
    const token = data?.accessToken ?? data?.token;
    const role = token
      ? getRoleFromAccessToken(token)
      : normalizeNumericOrStringRole(data?.role);

    return {
      message: getFallbackMessage(message, data?.message, "Login successful.") ?? "Login successful.",
      role,
      token,
      refreshToken: data?.refreshToken,
      redirectTo: role ? getRoleHome(role) : undefined,
    };
  }

  await wait(900);
  const role = inferRoleFromIdentifier(payload.identifier);

  return {
    message: `Dummy ${getRoleLabel(role)} session created. Redirecting to the ${getRoleLabel(role)} workspace.`,
    redirectTo: getRoleHome(role),
    role,
    token: `mock-token-${role}`,
  };
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<ApiEnvelope<unknown> | { message?: string }>(
      apiEndpoints.auth.register,
      mapRegisterPayload(payload),
    );
    const { message } = unwrapEnvelope(response.data);

    return {
      message:
        getFallbackMessage(message, "Registration successful. You can now sign in.") ??
        "Registration successful. You can now sign in.",
      redirectTo: "/auth/login",
    };
  }

  await wait(1100);

  if (payload.role === "student") {
    return {
      message: `Student registration captured for ${payload.matricNo}. Backend student onboarding will plug into this service next.`,
      redirectTo: "/auth/login",
    };
  }

  if (payload.role === "admin") {
    return {
      message: "Admin registration captured locally. Live backend registration will replace this fallback.",
      redirectTo: "/auth/login",
    };
  }

  return {
    message: "Supervisor registration captured locally. Live backend registration will replace this fallback.",
    redirectTo: "/auth/login",
  };
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload,
): Promise<AuthResponse> {
  if (hasConfiguredApiBaseUrl()) {
    const response = await apiClient.post<ApiEnvelope<AuthResponse> | AuthResponse>(
      apiEndpoints.auth.forgotPassword,
      payload,
    );
    const { message, data } = unwrapEnvelope<AuthResponse>(response.data);

    return {
      ...data,
      message:
        getFallbackMessage(message, data?.message, "Reset instructions sent.") ??
        "Reset instructions sent.",
    };
  }

  await wait(800);

  return {
    message: `Reset instructions would be sent to ${payload.email} once backend recovery is connected.`,
  };
}

export async function revokeSession(): Promise<{ message: string }> {
  if (hasConfiguredApiBaseUrl()) {
    await apiClient.post(apiEndpoints.auth.revoke);

    return {
      message: "Session revoked successfully.",
    };
  }

  await wait(400);

  return {
    message: "Session cleared locally.",
  };
}
