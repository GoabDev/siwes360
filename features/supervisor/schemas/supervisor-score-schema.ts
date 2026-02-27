import { z } from "zod";

export const supervisorSearchSchema = z.object({
  matricNumber: z.string().min(5, "Enter a valid matric number."),
});

export const supervisorScoreSchema = z.object({
  score: z.coerce
    .number()
    .min(0, "Score cannot be below 0.")
    .max(10, "Score cannot be greater than 10."),
  note: z.string().min(10, "Add a short note for this evaluation."),
});

export type SupervisorSearchSchema = z.infer<typeof supervisorSearchSchema>;
export type SupervisorScoreSchemaInput = z.input<typeof supervisorScoreSchema>;
export type SupervisorScoreSchema = z.infer<typeof supervisorScoreSchema>;
