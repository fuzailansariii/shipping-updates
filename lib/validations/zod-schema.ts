import * as z from "zod";

/* =========================
   COMMON SCHEMA
========================= */

export const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must only contain numbers"),
});

/* =========================
   BASE SCHEMA
========================= */

export const baseSchema = z.object({
  type: z.enum(["book", "pdf"], {
    error: "Product type is required",
  }),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  topics: z.array(z.string().trim()).min(1, "At least 1 topic required"),
  thumbnail: z.url(),
  images: z.array(z.url()).default([]).optional(),
  language: z.string().min(1),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

/* =========================
   BOOK SCHEMA
========================= */

export const bookSchema = baseSchema.extend({
  type: z.literal("book"),

  // Book-required fields
  author: z.string().trim().min(1, "Author is required for Books"),
  stockQuantity: z
    .number()
    .int()
    .min(1, "Stock quantity must be at least 1 for Books"),

  // Book Optional fields
  publisher: z.string().trim().optional(),
  isbn: z.string().trim().optional(),
  edition: z.string().trim().optional(),

  // PDF fields should be optional/nullable for books
  fileUrl: z.string().optional(),
  fileSize: z.number().optional(),
});

/* =========================
   PDF SCHEMA
========================= */

export const pdfSchema = baseSchema.extend({
  type: z.literal("pdf"), // Must be "pdf"

  // PDF-required fields
  fileUrl: z.url("Valid file URL is required for PDFs"),
  fileSize: z.number().positive("File size is required for PDFs"),

  // PDFs always have 0 stock (digital = unlimited)
  stockQuantity: z.literal(0).optional(),

  // Book fields should be optional for PDFs
  author: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  edition: z.string().optional(),
});

export const productSchema = z.discriminatedUnion("type", [
  bookSchema,
  pdfSchema,
]);

export const productSchemaProcessed = productSchema.transform((data) => ({
  ...data,
  price: parseFloat(data.price),
  isActive: data.isActive ?? false,
  isFeatured: data.isFeatured ?? false,
}));

/* =========================
   UPDATE SCHEMA
========================= */

export const baseUpdateFields = baseSchema.omit({ type: true }).partial();

export const updateBookSchema = baseUpdateFields.extend({
  type: z.literal("book"),
  author: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
  isbn: z.string().trim().optional(),
  edition: z.string().trim().optional(),
  stockQuantity: z.number().int().min(1).optional(),
  // allowing these to be undefined for books
  fileUrl: z.string().optional(),
  fileSize: z.number().optional(),
});

export const updatePdfSchema = baseUpdateFields.extend({
  type: z.literal("pdf"),
  fileUrl: z.url().optional(),
  fileSize: z.number().positive().optional(),
  stockQuantity: z.literal(0).optional(),
  // allowing these to be undefined for PDFs
  author: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
  isbn: z.string().trim().optional(),
  edition: z.string().trim().optional(),
});

export const updateProductSchema = z.discriminatedUnion("type", [
  updateBookSchema,
  updatePdfSchema,
]);

/* =========================
   ORDER-ITEM SCHEMA
========================= */

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  productType: z.enum(["book", "pdf"]),
  productTitle: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

/* =========================
   ADDRESS SCHEMA
========================= */

export const addressSchema = z.object({
  id: z.string().optional(),
  // clerkUserId: z.string().min(1, "UserID is required"),
  fullName: z.string().min(1, "FullName is requried"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .transform((val) => val.trim()),
  addressLine1: z.string().min(5, "Address is requires").max(200),
  addressLine2: z.string().max(200).nullable().optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z
    .string()
    .regex(/^\d{6}/, "Pin-Code must be exactly 6 digits")
    .transform((val) => val.trim()),
  landmark: z.string().max(200).nullable().optional(),
  isDefault: z.boolean(),
});

export const addressApiSchema = addressSchema.extend({
  clerkUserId: z.string().min(1),
});

export type AddressInput = z.infer<typeof addressSchema>;

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
  subTotal: z.number().positive("Sub Total must be Positive"),
  shippingCharges: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  totalAmount: z.number().positive("Total amount must be positive"),
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

/* =========================
   PAYMENT VERIFICATION SCHEMA
========================= */

export const paymentVerificationSchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type PaymentVerificationInput = z.infer<
  typeof paymentVerificationSchema
>;

/* =========================
   MESSAGE SCHEMA
========================= */

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

/* =========================
   TYPES
========================= */

export type BookFormData = z.infer<typeof bookSchema>;
export type PdfFormData = z.infer<typeof pdfSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ProductData = z.infer<typeof productSchemaProcessed>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type MessageData = z.infer<typeof messageSchema>;
