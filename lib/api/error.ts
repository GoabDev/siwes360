import axios from "axios";

type ApiErrorEnvelope = {
  message?: string | null;
  error?: string | null;
  title?: string | null;
  errors?: Record<string, string[] | string | undefined> | null;
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

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorEnvelope>(error)) {
    const payload = error.response?.data;
    const message =
      payload?.message ??
      payload?.error ??
      payload?.title ??
      flattenValidationErrors(payload?.errors);

    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}
