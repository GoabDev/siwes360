"use client";

import axios from "axios";
import { apiConfig } from "@/lib/api/config";

export const apiClient = axios.create({
  baseURL: undefined,
  timeout: apiConfig.timeout,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
