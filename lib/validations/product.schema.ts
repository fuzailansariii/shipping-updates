import * as z from "zod";

/* =========================================================
   COMMON SCHEMAS
========================================================= */

export const productTypeEnum = z.enum(["book", "pdf"]);

export const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must only contain numbers"),
});

/* =========================================================
   PRICE FIELDS
========================================================= */

// Frontend price (string - rupees)
const priceStringField = z
  .string()
  .min(1, "Price is required")
  .superRefine((val, ctx) => {
    const num = Number(val);
    if (isNaN(num) || val.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Price must be a valid number",
      });
      return;
    }
    if (num <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Price must be greater than 0",
      });
      return;
    }
    if (num > 1_00_00) {
      // add your own max
      ctx.addIssue({
        code: "custom",
        message: "Price cannot exceed ₹10,000",
      });
    }
  });

const priceNumberField = z.preprocess((val) => {
  // If string from frontend, parse and convert to paise
  if (typeof val === "string") {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return undefined; // will fail validation
    return Math.round(num * 100);
  }

  // If number (already in paise), just pass through
  if (typeof val === "number") {
    if (val <= 0) return undefined; // invalid
    return val;
  }

  return undefined; // invalid type
}, z.number().positive("Invalid price"));

/* =========================================================
   BASE PRODUCT FIELDS
========================================================= */

const baseProductFields = {
  type: productTypeEnum,
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  topics: z.array(z.string().trim()).min(1, "At least 1 topic required"),
  thumbnail: z.url("Valid thumbnail URL required"),
  language: z.string().min(1, "Language is required"),
  images: z.array(z.url()).max(10).optional().default([]),
  isActive: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
};

/* =========================================================
   FRONTEND SCHEMAS (FOR FORMS ONLY)
========================================================= */

export const frontendBaseSchema = z.object({
  ...baseProductFields,
  price: priceStringField,
});

// Frontend Book
export const frontendBookSchema = frontendBaseSchema
  .extend({
    type: z.literal("book"),
    author: z.string().min(1, "Author is required"),
    stockQuantity: z.number().int().min(1, "Stock must be at least 1"),
    publisher: z.string().optional(),
    isbn: z.string().optional(),
    edition: z.string().optional(),
  })
  .strict();

// Frontend PDF
export const frontendPdfSchema = frontendBaseSchema
  .extend({
    type: z.literal("pdf"),
    fileUrl: z.url("Valid file URL required"),
    fileSize: z.number().positive("File size required"),
  })
  .strict();

// Combined Frontend Schema
export const frontendSchema = z.discriminatedUnion("type", [
  frontendBookSchema,
  frontendPdfSchema,
]);

export type FrontendProductData = z.infer<typeof frontendSchema>;

/* =========================================================
   BACKEND SCHEMAS (SOURCE OF TRUTH)
========================================================= */

export const backendBaseSchema = z.object({
  ...baseProductFields,
  price: priceNumberField,
});

// Backend Book
export const backendBookSchema = backendBaseSchema
  .extend({
    type: z.literal("book"),
    author: z.string().optional(),
    stockQuantity: z.number().int().min(1, "Stock must be at least 1"),
    publisher: z.string().optional(),
    isbn: z.string().optional(),
    edition: z.string().optional(),
  })
  .strict();

// Backend PDF
export const backendPdfSchema = backendBaseSchema
  .extend({
    type: z.literal("pdf"),
    fileUrl: z.url("Valid file URL required"),
    fileSize: z.number().positive("File size required"),
  })
  .strict();

// Combined Backend Schema
export const backendSchema = z.discriminatedUnion("type", [
  backendBookSchema,
  backendPdfSchema,
]);

export type BackendProductData = z.infer<typeof backendSchema>;

/* =========================================================
   UPDATE SCHEMAS
========================================================= */

// Frontend Update Book
export const frontendUpdateBookSchema = frontendBookSchema.partial({
  title: true,
  description: true,
  price: true,
  topics: true,
  thumbnail: true,
  images: true,
  language: true,
  isActive: true,
  isFeatured: true,
  author: true,
  stockQuantity: true,
  publisher: true,
  isbn: true,
  edition: true,
});

// Frontend Update PDF
export const frontendUpdatePdfSchema = frontendPdfSchema.partial({
  title: true,
  description: true,
  price: true,
  topics: true,
  thumbnail: true,
  images: true,
  language: true,
  isActive: true,
  isFeatured: true,
  fileUrl: true,
  fileSize: true,
});

export const frontendUpdateProductSchema = z.discriminatedUnion("type", [
  frontendUpdateBookSchema,
  frontendUpdatePdfSchema,
]);

export type FrontendUpdateProductValues = z.infer<
  typeof frontendUpdateProductSchema
>;

// Backend Update Book
export const backendUpdateBookSchema = backendBookSchema
  .partial({
    title: true,
    description: true,
    price: true,
    topics: true,
    thumbnail: true,
    images: true,
    language: true,
    isActive: true,
    isFeatured: true,
    author: true,
    publisher: true,
    isbn: true,
    edition: true,
  })
  .extend({
    // stockQuantity allows 0 on update (sold out)
    stockQuantity: z.number().int().min(0).optional(),
  });

// Backend Update PDF
export const backendUpdatePdfSchema = backendPdfSchema.partial({
  title: true,
  description: true,
  price: true,
  topics: true,
  thumbnail: true,
  images: true,
  language: true,
  isActive: true,
  isFeatured: true,
  fileUrl: true,
  fileSize: true,
});

export const backendUpdateProductSchema = z.discriminatedUnion("type", [
  backendUpdateBookSchema,
  backendUpdatePdfSchema,
]);

export type BackendUpdateProductValues = z.infer<
  typeof backendUpdateProductSchema
>;

/* =========================================================
   PREVIEW SCHEMA
========================================================= */

export const previewSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    }),
  ),
});

/* =========================================================
   OTHER TYPES
========================================================= */
export type ProductType = "book" | "pdf";
export type BookFormData = z.input<typeof frontendBookSchema>;
export type PdfFormData = z.input<typeof frontendPdfSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;

// Update
export type FrontendUpdateBookValues = z.infer<typeof frontendUpdateBookSchema>;
export type FrontendUpdatePdfValues = z.infer<typeof frontendUpdatePdfSchema>;

// Rate limit
export const RATE_LIMIT_MS = 5000;
