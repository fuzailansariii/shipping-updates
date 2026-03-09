import z from "zod";
import { isAdmin } from "./auth-helper";
import { NextResponse } from "next/server";

// orderId validation
export const nanoidSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{21}$/, "Invalid Order ID");

export async function validateAdminRequest(params: Promise<{ id: string }>) {
  //   admin check
  const admin = await isAdmin();
  if (!admin) {
    return {
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const { id: orderId } = await params;
  const idResult = nanoidSchema.safeParse(orderId);
  if (!idResult.success) {
    return {
      response: NextResponse.json(
        { success: false, error: "Invalid Order ID" },
        { status: 400 },
      ),
    };
  }
  return { orderId: idResult.data };
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    return {
      response: NextResponse.json(
        { success: false, error: "Unauthorized, Admin access is required" },
        { status: 401 },
      ),
    };
  }
  return { ok: true };
}
