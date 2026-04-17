import { createClient } from "redis";
import { safeAwait } from "../utils/safe-await.js";

export async function createRedisClient(url: string, port: number) {
  const redisClient = createClient({
    url: `redis://${url}:${port}`,
  });

  const [error] = await safeAwait(redisClient.connect());
  if (error) {
    await redisClient.quit();
    throw new Error("Redis connection failed");
  }
  return redisClient;
}
