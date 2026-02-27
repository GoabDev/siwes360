import { z } from "zod";
import { departments } from "@/features/student/constants/departments";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Enter your email, staff ID, or matric number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const passwordFields = {
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Confirm your password."),
};

export const studentRegisterSchema = z
  .object({
    role: z.literal("student"),
    fullName: z.string().min(3, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    matricNumber: z.string().min(5, "Enter a valid matric number."),
    department: z.enum(departments as [string, ...string[]], {
      error: "Select your department.",
    }),
    ...passwordFields,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const supervisorOnboardingSchema = z
  .object({
    role: z.literal("supervisor"),
    fullName: z.string().min(3, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    staffId: z.string().min(3, "Enter your staff ID."),
    phoneNumber: z.string().min(7, "Enter a valid phone number."),
    organization: z.string().min(2, "Enter your school, faculty, or organization."),
    ...passwordFields,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const registerSchema = z.discriminatedUnion("role", [
  studentRegisterSchema,
  supervisorOnboardingSchema,
]);

export const forgotPasswordSchema = z.object({
  email: z.email("Enter the email address linked to your account."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type StudentRegisterSchema = z.infer<typeof studentRegisterSchema>;
export type SupervisorOnboardingSchema = z.infer<typeof supervisorOnboardingSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
