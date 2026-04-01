"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createSessionAction } from "@/features/auth/actions/auth-session-actions";
import { useLoginMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/schemas/auth-schemas";
import { getApiErrorMessage } from "@/lib/api/error";
import { useAuthSession } from "@/providers/auth-session-provider";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const { signIn } = useAuthSession();
  const [isRedirecting, startTransition] = useTransition();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const loginPromise = loginMutation.mutateAsync(values);

      await toast.promise(loginPromise, {
        loading: "Signing you in...",
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to complete sign in."),
      });

      const result = await loginPromise;

      if (!result.role) {
        throw new Error("Login response did not include a user role.");
      }

      const authenticatedRole = result.role;

      startTransition(async () => {
        const sessionResult = await createSessionAction({
          role: authenticatedRole,
          token: result.token,
          refreshToken: result.refreshToken,
        });

        signIn(sessionResult.role, sessionResult.token, sessionResult.refreshToken);
        router.push(result.redirectTo ?? sessionResult.redirectTo);
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
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email, staff ID, or matric number</FormLabel>
              <FormControl>
                <Input
                  placeholder="student@example.com or CSC/2021/001"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <Label className="text-xs uppercase tracking-[0.2em] text-muted">
            Login
          </Label>
          <p className="mt-2 text-sm text-muted">
            Sign in with your email, staff ID, or matric number. Redirect is now
            based on the authenticated role returned by the backend.
          </p>
        </div>
        <Button
          type="submit"
          disabled={loginMutation.isPending || isRedirecting}
          className="w-full"
        >
          {loginMutation.isPending || isRedirecting
            ? "Signing in..."
            : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted">
          Need an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-brand transition hover:text-brand-strong"
          >
            Register
          </Link>
        </p>
      </form>
    </Form>
  );
}
