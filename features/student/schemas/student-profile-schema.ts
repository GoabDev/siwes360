import { z } from "zod";

const optionalTextField = z.string().optional().or(z.literal(""));

export const studentProfileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  matricNumber: z.string().min(5, "Enter a valid matric number."),
  department: z.string().min(2, "Select your department."),
  phoneNumber: optionalTextField,
});

export type StudentProfileSchema = z.infer<typeof studentProfileSchema>;
