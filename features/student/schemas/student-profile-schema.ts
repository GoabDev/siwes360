import { z } from "zod";

export const studentProfileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  matricNumber: z.string().min(5, "Enter a valid matric number."),
  department: z.string().min(2, "Select your department."),
  phoneNumber: z.string().min(7, "Enter a valid phone number."),
  placementCompany: z.string().min(2, "Enter your SIWES placement company."),
  placementAddress: z.string().min(10, "Enter the placement address."),
  workplaceSupervisorName: z.string().min(3, "Enter the workplace supervisor name."),
  startDate: z.string().min(1, "Select a SIWES start date."),
  endDate: z.string().min(1, "Select a SIWES end date."),
  bio: z.string().min(20, "Write a short academic or placement summary."),
});

export type StudentProfileSchema = z.infer<typeof studentProfileSchema>;
