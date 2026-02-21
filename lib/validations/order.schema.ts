import z from "zod";
import { productTypeEnum } from "./product.schema";

/* =========================
   ORDER-ITEM SCHEMA
========================= */
export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productType: productTypeEnum,
  // productTitle: z.string().min(1),
  quantity: z.number().int().positive(),
  // unitPrice: z.number().positive(),
  // totalPrice: z.number().positive(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

/* =========================
   Checkout SCHEMA
========================= */
export const checkoutSchema = z.object({
  clerkUserId: z.string().min(1, "UserID is required"),
  buyerEmail: z.string().min(1, "Buyer email is required"),
  buyerName: z.string().min(1, "Buyer Name is required"),
  buyerPhone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .transform((val) => val.trim()),
  shippingAddress: z.string().min(10, "Shipping Address is required"),
  billingAddress: z.string().optional(), // Defaults to shipping if not provided
  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required in the order"),
  // subTotal: z.number().positive("Sub Total must be Positive"),
  // shippingCharges: z.number().min(0).default(0),
  // tax: z.number().min(0).default(0),
  // discount: z.number().min(0).default(0),
  // totalAmount: z.number().positive("Total amount must be positive"),
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
  // Payment updates optional for now
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .default("pending"),
  notes: z.string().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
