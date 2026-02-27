"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useRegisterMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  supervisorOnboardingSchema,
  type SupervisorOnboardingSchema,
} from "@/features/auth/schemas/auth-schemas";

export function SupervisorOnboardingForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const form = useForm<SupervisorOnboardingSchema>({
    resolver: zodResolver(supervisorOnboardingSchema),
    defaultValues: {
      role: "supervisor",
      fullName: "",
      email: "",
      staffId: "",
      phoneNumber: "",
      organization: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const registrationPromise = registerMutation.mutateAsync(values);

      await toast.promise(registrationPromise, {
        loading: "Preparing supervisor access...",
        success: (data) => data.message,
        error: "Unable to continue supervisor onboarding.",
      });

      const result = await registrationPromise;

      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch {
      return;
    }
  });

  return (
    <SurfaceCard className="space-y-5">
      <SectionHeading
        eyebrow="Supervisor access"
        title="Set up supervisor onboarding with minimal assumptions"
        description="The project document does not define a detailed public supervisor registration flow the same way it does for students, so this frontend flow is kept intentionally lightweight until backend rules are finalized."
      />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="supervisor@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff ID</FormLabel>
                  <FormControl>
                    <Input placeholder="SUP-1042" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="08098765432" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School, faculty, or organization</FormLabel>
                <FormControl>
                  <Input placeholder="School of Engineering" {...field} />
                </FormControl>
                <FormDescription>
                  This is kept broad until the backend confirms the final supervisor onboarding rules.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
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
                    <Input type="password" placeholder="Repeat your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={registerMutation.isPending} className="w-full md:w-auto">
            {registerMutation.isPending ? "Preparing supervisor access..." : "Continue as supervisor"}
          </Button>
        </form>
      </Form>
    </SurfaceCard>
  );
}
