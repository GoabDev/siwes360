"use client";

import { useMutation } from "@tanstack/react-query";
import {
  confirmEmail,
  loginUser,
  requestPasswordReset,
  registerUser,
  resendEmailVerification,
  setPassword,
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

export function useConfirmEmailMutation() {
  return useMutation({
    mutationFn: confirmEmail,
  });
}

export function useResendEmailVerificationMutation() {
  return useMutation({
    mutationFn: resendEmailVerification,
  });
}

export function useSetPasswordMutation() {
  return useMutation({
    mutationFn: setPassword,
  });
}
