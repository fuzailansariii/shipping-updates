import { z } from "zod";

export const idSchema = z
  .string()
  .length(21)
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid ID format");

export function validateId(id: string) {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    throw new Error("Invalid ID");
  }
  return parsed.data;
}
