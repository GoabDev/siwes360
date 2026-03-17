import { z } from "zod";

export const inviteSupervisorSchema = z.object({
  fullName: z.string().min(3, "Enter the supervisor's full name."),
  email: z.email("Enter a valid email address."),
  departmentId: z.uuid("Select a department."),
});

export type InviteSupervisorSchema = z.infer<typeof inviteSupervisorSchema>;
