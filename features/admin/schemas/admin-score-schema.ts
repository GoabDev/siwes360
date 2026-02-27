import { z } from "zod";

export const adminScoreSchema = z.object({
  logbookScore: z.coerce
    .number()
    .min(0, "Logbook score cannot be below 0.")
    .max(30, "Logbook score cannot be greater than 30."),
  presentationScore: z.coerce
    .number()
    .min(0, "Presentation score cannot be below 0.")
    .max(30, "Presentation score cannot be greater than 30."),
  note: z.string().min(10, "Add a short grading note."),
});

export type AdminScoreSchemaInput = z.input<typeof adminScoreSchema>;
export type AdminScoreSchema = z.infer<typeof adminScoreSchema>;
