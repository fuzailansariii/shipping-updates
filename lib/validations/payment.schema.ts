/* =========================
   PAYMENT VERIFICATION SCHEMA
========================= */

import z from "zod";

export const paymentVerificationSchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type PaymentVerificationInput = z.infer<
  typeof paymentVerificationSchema
>;
