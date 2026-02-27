"use client";

import axios from "axios";
import { AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth/session-config";
import { apiConfig } from "@/lib/api/config";

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
