import { z } from "zod";

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const studentReportSchema = z.object({
  title: z.string().min(3, "Enter a report title."),
  summary: z.string().min(20, "Add a short summary for the submission."),
  file: z
    .instanceof(File, { message: "Select a report file." })
    .refine((file) => allowedTypes.includes(file.type), "Only PDF or DOCX files are allowed.")
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be 10MB or less.",
    ),
});

export type StudentReportSchema = z.infer<typeof studentReportSchema>;
