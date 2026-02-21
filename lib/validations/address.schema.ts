/* =========================
   ADDRESS SCHEMA
========================= */

import z from "zod";

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
