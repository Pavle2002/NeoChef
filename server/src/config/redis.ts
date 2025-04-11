import client from "redis";
import config from "@config/config.js";
import { safeAwait } from "@utils/safe-await.js";
import logger from "@config/logger.js";

const redisClient = client.createClient({
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
export default redisClient;
