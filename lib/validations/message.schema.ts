/* =========================
   MESSAGE SCHEMA
========================= */

import z from "zod";

export const contactSubjects = [
  "study_materials",
  "payment_issue",
  "access_problem",
  "exam_guidance",
  "general_inquiry",
  "feedback",
] as const;

export const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is required"),
  subject: z.enum(contactSubjects, {
    message: "please select a subject",
  }),
  message: z.string().min(1, "Message is required"),
});

export type MessageData = z.infer<typeof messageSchema>;
