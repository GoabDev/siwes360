import { z } from "zod";

export const adminProfileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  staffId: z.string().min(3, "Enter your admin or staff ID."),
  department: z.string().min(2, "Enter the department name."),
  officePhone: z.string().min(7, "Enter a valid office phone."),
  roleTitle: z.string().min(2, "Enter your role title."),
  bio: z.string().min(20, "Provide a short admin summary."),
});

export type AdminProfileSchema = z.infer<typeof adminProfileSchema>;
