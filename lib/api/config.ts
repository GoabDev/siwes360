const rawTimeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS);

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "",
  timeout: Number.isFinite(rawTimeout) && rawTimeout > 0 ? rawTimeout : 60_000,
};

export function hasConfiguredApiBaseUrl() {
  return Boolean(apiConfig.baseURL);
}

export function getConfiguredApiOrigin() {
  if (!apiConfig.baseURL) {
    return null;
  }

  try {
    return new URL(apiConfig.baseURL).origin;
  } catch {
    return null;
  }
}
