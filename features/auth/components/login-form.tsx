"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createMockSessionAction } from "@/features/auth/actions/auth-session-actions";
import { useLoginMutation } from "@/features/auth/queries/use-auth-mutations";
import { loginSchema, type LoginSchema } from "@/features/auth/schemas/auth-schemas";
import { useAuthSession } from "@/providers/auth-session-provider";

export function LoginForm() {
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
      await toast.promise(loginMutation.mutateAsync(values), {
        loading: "Signing you in...",
        success: (data) => data.message,
        error: "Unable to complete sign in.",
      });

      startTransition(async () => {
        const sessionResult = await createMockSessionAction({
          identifier: values.identifier,
        });

        signIn(sessionResult.role, sessionResult.token);
        window.location.href = sessionResult.redirectTo;
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
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <Label className="text-xs uppercase tracking-[0.2em] text-muted">Mock role hints</Label>
          <p className="mt-2 text-sm text-muted">
            Use an identifier containing <span className="font-medium text-foreground">admin</span>
            {" "}or <span className="font-medium text-foreground">supervisor</span> to test protected redirects before the backend is ready.
          </p>
        </div>
        <Button
          type="submit"
          disabled={loginMutation.isPending || isRedirecting}
          className="w-full"
        >
          {loginMutation.isPending || isRedirecting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
