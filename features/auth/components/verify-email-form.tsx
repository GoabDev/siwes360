"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  confirmEmailSchema,
  type ConfirmEmailSchema,
} from "@/features/auth/schemas/auth-schemas";
import { useConfirmEmailMutation } from "@/features/auth/queries/use-auth-mutations";
import { ResendVerificationForm } from "@/features/auth/components/resend-verification-form";
import { getApiErrorMessage } from "@/lib/api/error";

type VerifyEmailFormProps = {
  userId?: string;
  token?: string;
  email?: string;
};

export function VerifyEmailForm({
  userId = "",
  token = "",
  email = "",
}: VerifyEmailFormProps) {
  const confirmEmailMutation = useConfirmEmailMutation();
  const autoSubmitTriggeredRef = useRef(false);

  const confirmValues = useMemo(
    () => ({
      userId: userId.trim(),
      token: token.trim(),
    }),
    [token, userId],
  );

  const confirmParseResult = useMemo(
    () => confirmEmailSchema.safeParse(confirmValues),
    [confirmValues],
  );

  const runEmailVerification = useCallback(async (payload: ConfirmEmailSchema) => {
    try {
      await toast.promise(confirmEmailMutation.mutateAsync(payload), {
        loading: "Verifying your email...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to verify your email."),
      });
    } catch {
      return;
    }
  }, [confirmEmailMutation]);

  useEffect(() => {
    if (autoSubmitTriggeredRef.current || !confirmParseResult.success) {
      return;
    }

    autoSubmitTriggeredRef.current = true;

    const payload: ConfirmEmailSchema = confirmParseResult.data;

    void runEmailVerification(payload);
  }, [confirmParseResult, runEmailVerification]);

  const isMissingVerificationParams = !userId.trim() || !token.trim();
  const verificationErrorMessage = confirmParseResult.success
    ? null
    : confirmParseResult.error.issues[0]?.message ?? "Verification link is invalid.";
  const isVerifying = confirmEmailMutation.isPending;
  const isVerified = confirmEmailMutation.isSuccess;
  const verificationFailed = confirmEmailMutation.isError;
  const shouldHideResendSection = isVerifying || isVerified;

  return (
    <div className="space-y-6">
      <div className="rounded-[1.4rem] border border-border/70 bg-background/65 p-5">
        <h2 className="text-lg font-semibold">Verification status</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {isMissingVerificationParams
            ? "Open the verification link from your email, or request another verification email below."
            : "Your verification link was detected. The page will confirm your email automatically."}
        </p>

        {isMissingVerificationParams ? (
          <p className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-4 text-sm text-amber-700">
            This page needs both a `userId` and `token` in the URL before email confirmation can run.
          </p>
        ) : null}

        {!isMissingVerificationParams && !confirmParseResult.success ? (
          <p className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
            {verificationErrorMessage}
          </p>
        ) : null}

        {!isMissingVerificationParams && confirmParseResult.success ? (
          <div className="mt-4 rounded-2xl border p-4 text-sm leading-6">
            {isVerifying ? (
              <p>Verification in progress. This usually takes a moment.</p>
            ) : null}
            {isVerified ? (
              <p className="text-brand-strong">
                Your email has been verified. You can continue to the login page.
              </p>
            ) : null}
            {verificationFailed ? (
              <p className="text-destructive">
                Verification failed. Request another email below or retry from the message in your inbox.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/auth/login">Go to login</Link>
          </Button>
          {isVerified ? null : (
            <Button
              type="button"
              onClick={() => {
                if (!confirmParseResult.success) {
                  return;
                }

                void runEmailVerification(confirmParseResult.data);
              }}
              disabled={!confirmParseResult.success || isVerifying}
            >
              Retry verification
            </Button>
          )}
        </div>
      </div>

      {shouldHideResendSection ? null : (
        <div className="rounded-[1.4rem] border border-border/70 bg-background/65 p-5">
          <h2 className="text-lg font-semibold">Resend verification email</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Enter the email address used during signup and we will trigger a new verification message.
          </p>

          <div className="mt-5">
            <ResendVerificationForm email={email} />
          </div>
        </div>
      )}
    </div>
  );
}
