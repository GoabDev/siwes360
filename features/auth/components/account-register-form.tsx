"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useDepartmentsQuery } from "@/features/auth/queries/use-department-query";
import { useRegisterMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  adminRegisterSchema,
  studentRegisterSchema,
  supervisorRegisterSchema,
  type AdminRegisterSchema,
  type StudentRegisterSchema,
  type SupervisorRegisterSchema,
} from "@/features/auth/schemas/auth-schemas";
import type { RegisterPayload } from "@/features/auth/types/auth";
import { getApiErrorMessage } from "@/lib/api/error";

type RegistrationRole = "student" | "supervisor" | "admin";
type RegisterFormValues =
  | StudentRegisterSchema
  | SupervisorRegisterSchema
  | AdminRegisterSchema;

const copyByRole: Record<
  RegistrationRole,
  {
    eyebrow: string;
    title: string;
    description: string;
    submitIdle: string;
    submitBusy: string;
  }
> = {
  student: {
    eyebrow: "Student registration",
    title: "Register with your matric number and department",
    description:
      "Students must be linked to the correct department before they can continue into the SIWES workflow.",
    submitIdle: "Create student account",
    submitBusy: "Creating student account...",
  },
  supervisor: {
    eyebrow: "Supervisor registration",
    title: "Create a supervisor account for the right department",
    description:
      "Supervisor registration now uses the live backend flow instead of the earlier placeholder onboarding form.",
    submitIdle: "Create supervisor account",
    submitBusy: "Creating supervisor account...",
  },
  admin: {
    eyebrow: "Admin registration",
    title: "Create a department administrator account",
    description:
      "Administrator registration is now wired to the backend and uses the same department lookup as the student flow.",
    submitIdle: "Create admin account",
    submitBusy: "Creating admin account...",
  },
};

function getSchema(role: RegistrationRole) {
  if (role === "student") {
    return studentRegisterSchema;
  }

  if (role === "supervisor") {
    return supervisorRegisterSchema;
  }

  return adminRegisterSchema;
}

function getDefaultValues(role: RegistrationRole): RegisterFormValues {
  if (role === "student") {
    return {
      role,
      firstName: "",
      lastName: "",
      email: "",
      matricNo: "",
      departmentId: "",
      password: "",
      confirmPassword: "",
    };
  }

  return {
    role,
    firstName: "",
    lastName: "",
    email: "",
    matricNo: "",
    departmentId: "",
    password: "",
    confirmPassword: "",
  };
}

export function AccountRegisterForm({ role }: { role: RegistrationRole }) {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const departmentsQuery = useDepartmentsQuery();
  const copy = copyByRole[role];

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(getSchema(role)),
    defaultValues: getDefaultValues(role),
  });

  const departmentOptions = useMemo(
    () =>
      (departmentsQuery.data ?? []).map((department) => ({
        label: department.name,
        value: department.id,
      })),
    [departmentsQuery.data],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const registrationPromise = registerMutation.mutateAsync(values as RegisterPayload);

      await toast.promise(registrationPromise, {
        loading: copy.submitBusy,
        success: (data) => data.message,
        error: (error) => getApiErrorMessage(error, "Unable to complete registration."),
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
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Joseph" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ajogu" {...field} />
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
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === "student" ? (
              <FormField
                control={form.control}
                name="matricNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matric number</FormLabel>
                    <FormControl>
                      <Input placeholder="1101264021" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use the matric number recognized by your department.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className={role === "student" ? "" : "md:col-span-2"}>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            departmentsQuery.isLoading
                              ? "Loading departments..."
                              : "Select your department"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentOptions.map((department) => (
                        <SelectItem key={department.value} value={department.value}>
                          {department.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The selected department ID is what the backend expects for registration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {departmentsQuery.isError ? (
            <p className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
              Unable to load departments from the backend. Registration needs that lookup before
              submission can succeed.
            </p>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Create a password" {...field} />
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
                    <PasswordInput placeholder="Repeat your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending || departmentsQuery.isLoading || departmentsQuery.isError}
            className="w-full md:w-auto"
          >
            {registerMutation.isPending ? copy.submitBusy : copy.submitIdle}
          </Button>
        </form>
      </Form>
    </SurfaceCard>
  );
}
