import arcjet, { slidingWindow } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    slidingWindow({
      mode: "LIVE",
      max: 5,
      interval: "10s",
    }),
  ],
});

export async function checkRateLimit(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return { success: false };
  const decision = await aj.protect(request, { fingerprint: userId });
  return { success: decision.isAllowed() };
}
