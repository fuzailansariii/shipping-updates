import { auth } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function checkRateLimit() {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "10 s"),
  });

  const { userId } = await auth();

  if (!userId) {
    return { success: false, status: 401 };
  }

  const result = await ratelimit.limit(userId);

  return result;
}
