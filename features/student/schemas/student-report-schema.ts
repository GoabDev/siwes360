import { z } from "zod";

const allowedTypes = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const studentReportSchema = z.object({
  file: z
    .instanceof(File, { message: "Select a report file." })
    .refine((file) => allowedTypes.includes(file.type), "Only DOCX files are allowed.")
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be 10MB or less.",
    ),
});

export type StudentReportSchema = z.infer<typeof studentReportSchema>;
