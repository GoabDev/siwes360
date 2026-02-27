import { z } from "zod";

export const supervisorProfileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  staffId: z.string().min(3, "Enter your staff ID."),
  email: z.email("Enter a valid email address."),
  phoneNumber: z.string().min(7, "Enter a valid phone number."),
  department: z.string().min(2, "Enter your department."),
  organization: z.string().min(2, "Enter your organization or faculty."),
  bio: z.string().min(20, "Provide a short supervisor summary."),
});

export type SupervisorProfileSchema = z.infer<typeof supervisorProfileSchema>;
