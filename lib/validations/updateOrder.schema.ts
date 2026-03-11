import z from "zod";

export const updateOrderSchema = z
  .object({
    orderStatus: z
      .enum([
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "failed",
      ])
      .optional(),
    awbNumber: z.string().optional(),
    courierPartner: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided to update",
  });
