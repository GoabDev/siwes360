import { z } from "zod";

export const adminProfileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  department: z.string().min(2, "Enter the department name."),
});

export type AdminProfileSchema = z.infer<typeof adminProfileSchema>;
