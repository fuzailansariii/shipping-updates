import * as z from "zod";

export const emailSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .min(1, "Code must be 6 digit")
    .regex(/^\d+$/, "Code must only contain numbers"),
});

export const pdfSchema = z.object({
  title: z.string().trim().min(1, "File name is requrired"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  fileUrl: z.url(),
  fileSize: z.number().positive(),
  // pages: z.number().min(1),
  topics: z.array(z.string().trim()).min(1, "At least one topic required"),
  thumbnail: z.url().optional(),
  isActive: z.boolean().optional(),
});

export const pdfSchemaProcessed = pdfSchema.extend({
  price: z.number().positive("Price must be positive"),
  isActive: z.boolean().default(true),
});

export const purchaseSchema = z.object({
  pdfId: z.string().min(1),
  clerkUserId: z.string().min(1),
  buyerEmail: z.email("Buyer email is required"),
  buyerName: z.string().min(1, "Buyer name is required"),
  amount: z.number().positive(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .default("pending"),
});

export const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is required"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type PDFFormData = z.infer<typeof pdfSchema>;
export type PDFData = z.infer<typeof pdfSchemaProcessed>;
export type PurchaseData = z.infer<typeof purchaseSchema>;
export type MessageData = z.infer<typeof messageSchema>;
