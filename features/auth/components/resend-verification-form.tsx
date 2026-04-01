"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useResendEmailVerificationMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  resendEmailVerificationSchema,
  type ResendEmailVerificationSchema,
} from "@/features/auth/schemas/auth-schemas";
import { getApiErrorMessage } from "@/lib/api/error";

type ResendVerificationFormProps = {
  email?: string;
};

export function ResendVerificationForm({
  email = "",
}: ResendVerificationFormProps) {
  const resendEmailVerificationMutation = useResendEmailVerificationMutation();

  const form = useForm<ResendEmailVerificationSchema>({
    resolver: zodResolver(resendEmailVerificationSchema),
    defaultValues: {
      email,
    },
  });

  useEffect(() => {
    form.reset({
      email,
    });
  }, [email, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(resendEmailVerificationMutation.mutateAsync(values), {
        loading: "Sending another verification email...",
        success: (data) => data.message,
        error: (error) =>
          getApiErrorMessage(error, "Unable to resend the verification email."),
      });
    } catch {
      return;
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={resendEmailVerificationMutation.isPending}
          className="w-full"
        >
          {resendEmailVerificationMutation.isPending
            ? "Sending..."
            : "Resend verification email"}
        </Button>
      </form>
    </Form>
  );
}
