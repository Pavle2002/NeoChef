import client from "redis";
import config from "@config/config.js";
import { safeAwait } from "@utils/safe-await.js";

const redisClient = client.createClient({
  url: config.redis.url,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

const [error] = await safeAwait(redisClient.connect());
if (error) {
  console.error("Failed to connect to Redis database:", error);
  await redisClient.quit();
  throw new Error("Redis connection failed");
}

console.log("Connected to Redis database:", config.redis.url);
export default redisClient;
