import arcjet, { slidingWindow } from "@arcjet/next";
import { NextRequest } from "next/server";

// Strict - for order creation
const checkoutLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    slidingWindow({
      mode: "LIVE",
      max: 3,
      interval: "60s",
    }),
  ],
});

// Moderate - for payment initiation
const paymentCreateLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    slidingWindow({
      mode: "LIVE",
      max: 5,
      interval: "60s",
    }),
  ],
});

// Lenient - for payment verification
const paymentVerifyLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    slidingWindow({
      mode: "LIVE",
      max: 10,
      interval: "60s",
    }),
  ],
});

// General - for non-sensitive routes
const generalLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    slidingWindow({
      mode: "LIVE",
      max: 20,
      interval: "60s",
    }),
  ],
});

type LimiterType = "checkout" | "paymentCreate" | "paymentVerify" | "general";

const limiters = {
  checkout: checkoutLimiter,
  paymentCreate: paymentCreateLimiter,
  paymentVerify: paymentVerifyLimiter,
  general: generalLimiter,
};

export async function checkRateLimit(
  request: NextRequest,
  userId: string,
  type: LimiterType,
) {
  const limiter = limiters[type];
  const decision = await limiter.protect(request, { fingerprint: userId });
  return { success: decision.isAllowed() };
}
