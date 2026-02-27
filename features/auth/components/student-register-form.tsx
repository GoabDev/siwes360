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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useRegisterMutation } from "@/features/auth/queries/use-auth-mutations";
import {
  studentRegisterSchema,
  type StudentRegisterSchema,
} from "@/features/auth/schemas/auth-schemas";
import { departments } from "@/features/student/constants/departments";

export function StudentRegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const form = useForm<StudentRegisterSchema>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      matricNumber: "",
      department: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const registrationPromise = registerMutation.mutateAsync(values);

      await toast.promise(registrationPromise, {
        loading: "Creating student account...",
        success: (data) => data.message,
        error: "Unable to complete student registration.",
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
        eyebrow="Student registration"
        title="Register with your matric number and department"
        description="Department selection is required because your student account will later be linked to the correct departmental administrator."
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
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matricNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matric number</FormLabel>
                  <FormControl>
                    <Input placeholder="CSC/2021/014" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use the matric number recognized by your department.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This determines the departmental administrator your record is linked to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            {registerMutation.isPending ? "Creating student account..." : "Create student account"}
          </Button>
        </form>
      </Form>
    </SurfaceCard>
  );
}
