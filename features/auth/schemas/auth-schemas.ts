import { z } from "zod";

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

const registerSchemaBase = {
  firstName: z.string().min(2, "Enter your first name."),
  lastName: z.string().min(2, "Enter your last name."),
  email: z.email("Enter a valid email address."),
  departmentId: z.uuid("Select your department."),
  ...passwordFields,
};

export const studentRegisterSchema = z
  .object({
    role: z.literal("student"),
    ...registerSchemaBase,
    matricNo: z.string().min(5, "Enter a valid matric number."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const supervisorRegisterSchema = z
  .object({
    role: z.literal("supervisor"),
    ...registerSchemaBase,
    matricNo: z.string().optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const adminRegisterSchema = z
  .object({
    role: z.literal("admin"),
    ...registerSchemaBase,
    matricNo: z.string().optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const registerSchema = z.discriminatedUnion("role", [
  studentRegisterSchema,
  supervisorRegisterSchema,
  adminRegisterSchema,
]);

export const forgotPasswordSchema = z.object({
  email: z.email("Enter the email address linked to your account."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type StudentRegisterSchema = z.infer<typeof studentRegisterSchema>;
export type SupervisorRegisterSchema = z.infer<typeof supervisorRegisterSchema>;
export type AdminRegisterSchema = z.infer<typeof adminRegisterSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
