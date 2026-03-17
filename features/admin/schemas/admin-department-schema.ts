import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Enter a department name."),
  adminUserId: z.string().min(1, "Select an administrator."),
});

export type DepartmentSchema = z.infer<typeof departmentSchema>;
