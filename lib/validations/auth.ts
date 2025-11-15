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

export type EmailFormData = z.infer<typeof emailSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
