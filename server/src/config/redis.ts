import { createClient } from "redis";
import { safeAwait } from "@utils/safe-await.js";
import { logger } from "./logger.js";
import { config } from "./config.js";

export const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on("error", (err) => {
  logger.error(err);
});

const [error] = await safeAwait(redisClient.connect());
if (error) {
  logger.error(error);
  await redisClient.quit();
  throw new Error("Redis connection failed");
}

logger.info("Connected to Redis database", { address: config.redis.url });
