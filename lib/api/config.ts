export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "",
  timeout: 15_000,
};

export function hasConfiguredApiBaseUrl() {
  return Boolean(apiConfig.baseURL);
}
