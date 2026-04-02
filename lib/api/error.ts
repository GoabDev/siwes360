import axios from "axios";

type ApiErrorEnvelope = {
  code?: string | null;
  message?: string | null;
  error?: string | null;
  title?: string | null;
  errors?: Record<string, string[] | string | undefined> | null;
  details?: string | null;
};

function flattenValidationErrors(errors: ApiErrorEnvelope["errors"]) {
  if (!errors) {
    return undefined;
  }

  const messages = Object.values(errors).flatMap((value) => {
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  });

  return messages.find(Boolean);
}

function parseSerializedValidationDetails(details: string | null | undefined) {
  if (!details) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(details) as ApiErrorEnvelope["errors"];
    return flattenValidationErrors(parsed);
  } catch {
    return details.trim() || undefined;
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorEnvelope>(error)) {
    const payload = error.response?.data;
    const message =
      payload?.message ??
      payload?.error ??
      payload?.title ??
      flattenValidationErrors(payload?.errors) ??
      parseSerializedValidationDetails(payload?.details);

    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}
