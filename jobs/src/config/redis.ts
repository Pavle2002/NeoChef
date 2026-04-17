import { config } from "./config.js";
import { createRedisClient } from "@neochef/core";
import { logger } from "./logger.js";

const redisClient = await createRedisClient(
  config.redis.url,
  config.redis.port,
);

redisClient.on("error", (err) => {
  logger.error(err);
});

logger.info("Connected to Redis database", { address: config.redis.url });

export { redisClient };
