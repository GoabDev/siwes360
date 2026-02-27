import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Enter your email, staff ID, or matric number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    role: z.enum(["student", "supervisor", "admin"], {
      error: "Select a role.",
    }),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Enter the email address linked to your account."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
