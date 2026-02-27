"use client";

import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
} from "@/features/auth/services/auth-service";

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
}
