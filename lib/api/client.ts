"use client";

import axios from "axios";
import {
  clearSession,
  persistSession,
} from "@/features/auth/utils/mock-session";
import { getRoleFromAccessToken, isTokenExpiringSoon } from "@/features/auth/utils/jwt-auth";
import { apiConfig } from "@/lib/api/config";
import { apiEndpoints } from "@/lib/api/endpoints";
import {
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
} from "@/lib/auth/session-config";

type RefreshResponsePayload = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
  accessToken?: string;
  refreshToken?: string;
};

type RetryableRequestConfig = {
  _retry?: boolean;
};

const refreshClient = axios.create({
  baseURL: apiConfig.baseURL || undefined,
  timeout: apiConfig.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

function getStoredTokens() {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    accessToken: window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
    refreshToken: window.localStorage.getItem(AUTH_REFRESH_TOKEN_STORAGE_KEY),
  };
}

function extractRefreshTokens(payload: RefreshResponsePayload) {
  return {
    accessToken: payload.data?.accessToken ?? payload.accessToken ?? null,
    refreshToken: payload.data?.refreshToken ?? payload.refreshToken ?? null,
  };
}

async function refreshAccessToken() {
  const { accessToken, refreshToken } = getStoredTokens();

  if (!accessToken || !refreshToken) {
    clearSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponsePayload>(apiEndpoints.auth.refresh, {
        accessToken,
        refreshToken,
      })
      .then((response) => {
        const nextTokens = extractRefreshTokens(response.data);

        if (!nextTokens.accessToken || !nextTokens.refreshToken) {
          clearSession();
          return null;
        }

        const role = getRoleFromAccessToken(nextTokens.accessToken);

        if (!role) {
          clearSession();
          return null;
        }

        persistSession(role, nextTokens.accessToken, nextTokens.refreshToken);
        return nextTokens.accessToken;
      })
      .catch(() => {
        clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL || undefined,
  timeout: apiConfig.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const isAuthRequest =
    config.url === apiEndpoints.auth.login ||
    config.url === apiEndpoints.auth.refresh ||
    config.url === apiEndpoints.auth.register;

  if (isAuthRequest) {
    return config;
  }

  const { accessToken } = getStoredTokens();

  if (!accessToken || !isTokenExpiringSoon(accessToken)) {
    return config;
  }

  const nextAccessToken = await refreshAccessToken();

  if (nextAccessToken) {
    config.headers.Authorization = `Bearer ${nextAccessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === "undefined" || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as typeof error.config & RetryableRequestConfig;
    const status = error.response?.status;
    const isRefreshRequest = originalRequest.url === apiEndpoints.auth.refresh;
    const isLoginRequest = originalRequest.url === apiEndpoints.auth.login;

    if (status !== 401 || originalRequest._retry || isRefreshRequest || isLoginRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const nextAccessToken = await refreshAccessToken();

    if (!nextAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
    return apiClient(originalRequest);
  },
);
