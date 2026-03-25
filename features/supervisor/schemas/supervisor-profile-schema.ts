import { z } from "zod";

export const supervisorProfileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  department: z.string().min(2, "Enter your department."),
});

export type SupervisorProfileSchema = z.infer<typeof supervisorProfileSchema>;
