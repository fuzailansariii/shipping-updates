"use client";

// This hook only handles the shared API call logic.

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { RATE_LIMIT_MS } from "@/lib/validations/product.schema";

export function useProductSubmit() {
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const submitProduct = async (
    data: Record<string, unknown>,
  ): Promise<boolean> => {
    // UX debounce only — real rate limiting is on the server via checkRateLimit()
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remaining = Math.ceil(
        (RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000,
      );
      toast.error(
        `Please wait ${remaining} more second(s) before submitting again.`,
      );
      return false;
    }
    setLastSubmitTime(now);

    try {
      const response = await axios.post("/api/admin/products", data);
      toast.success(response.data.message);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          toast.error("Too many requests. Please slow down.");
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to do this.");
        } else {
          toast.error(
            error.response?.data?.error ?? "Upload failed. Please try again.",
          );
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    }
  };

  return { submitProduct };
}
