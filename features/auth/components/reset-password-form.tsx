"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useResetPasswordMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/features/auth/schemas/auth-schemas";
import { getApiErrorMessage } from "@/lib/api/error";

type ResetPasswordFormProps = {
  userId?: string;
  token?: string;
};

export function ResetPasswordForm({ userId = "", token = "" }: ResetPasswordFormProps) {
  const router = useRouter();
  const resetPasswordMutation = useResetPasswordMutation();
  const hasResetParams = Boolean(userId && token);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      userId,
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        await toast.promise(resetPasswordMutation.mutateAsync(values), {
          loading: "Resetting your password...",
          success: (data) => data.message,
          error: (error) => getApiErrorMessage(error, "Unable to reset your password."),
        });

        router.push("/auth/login");
      } catch {
        return;
      }
    },
    (errors) => {
      const hiddenFieldError = errors.userId?.message ?? errors.token?.message;
      const visibleFieldError = errors.confirmPassword?.message ?? errors.password?.message;

      toast.error(hiddenFieldError ?? visibleFieldError ?? "Fix the form errors and try again.");
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        {!hasResetParams ? (
          <p className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
            This reset link is incomplete. Make sure the email link includes both the user ID and
            token before trying again.
          </p>
        ) : null}

        {form.formState.errors.userId?.message || form.formState.errors.token?.message ? (
          <p className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
            {form.formState.errors.userId?.message ?? form.formState.errors.token?.message}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Create a new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Repeat your new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!hasResetParams || resetPasswordMutation.isPending}
          className="w-full"
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </Form>
  );
}
