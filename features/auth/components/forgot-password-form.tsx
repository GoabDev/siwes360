"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForgotPasswordMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/features/auth/schemas/auth-schemas";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await toast.promise(forgotPasswordMutation.mutateAsync(values), {
        loading: "Sending reset instructions...",
        success: (data) => data.message,
        error: "Unable to send reset instructions.",
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
        <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full">
          {forgotPasswordMutation.isPending ? "Sending..." : "Send instructions"}
        </Button>
      </form>
    </Form>
  );
}
