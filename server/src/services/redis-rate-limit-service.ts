import { logger } from "@config/logger.js";
import type { RateLimitResult } from "@interfaces/rate-limit-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";
import type { RedisClientType } from "redis";

const RATE_LIMIT_SCRIPT = `
local key = KEYS[1]
local window_start = tonumber(ARGV[1])
local now = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])
local unique_value = ARGV[5]

redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
local count = redis.call('ZCARD', key)

if count < limit then
    redis.call('ZADD', key, now, unique_value)
    redis.call('EXPIRE', key, ttl)
    return {1, count + 1}
else
    return {0, count}
end
`;

export class RedisRateLimitService {
  private fallbackCache = new Map<
    string,
    { count: number; expiresAt: number }
  >();

  constructor(private readonly redisClient: RedisClientType<any, any, any>) {}

  async checkLimit(
    identifier: string,
    endpoint: string,
    limit: number,
    windowMs: number,
  ): Promise<RateLimitResult> {
    const key = `${CacheKeys.RATE_LIMIT}${identifier}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const uniqueValue = `${now}-${Math.random()}`;
    const ttlSeconds = Math.ceil(windowMs / 1000);

    const [error, result] = await safeAwait(
      this.redisClient.eval(RATE_LIMIT_SCRIPT, {
        keys: [key],
        arguments: [
          windowStart.toString(),
          now.toString(),
          limit.toString(),
          ttlSeconds.toString(),
          uniqueValue,
        ],
      }),
    );

    if (error || !result) {
      logger.error("Redis rate limit error, using fallback:", error);
      return this.checkLimitFallback(key, limit, windowMs);
    }

    const [isAllowed, currentCount] = result as [number, number];
    const allowed = isAllowed === 1;

    return {
      allowed,
      remaining: Math.max(0, limit - currentCount),
      resetAt: now + windowMs,
      total: limit,
    };
  }

  private checkLimitFallback(
    key: string,
    limit: number,
    windowMs: number,
  ): RateLimitResult {
    const now = Date.now();
    let record = this.fallbackCache.get(key);

    if (record && now < record.expiresAt) {
      this.fallbackCache.delete(key);
      this.fallbackCache.set(key, record);

      if (record.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: record.expiresAt,
          total: limit,
        };
      }

      record.count++;
      return {
        allowed: true,
        remaining: limit - record.count,
        resetAt: record.expiresAt,
        total: limit,
      };
    }

    const newRecord = {
      count: 1,
      expiresAt: now + windowMs,
    };

    if (this.fallbackCache.size >= 10000) {
      const oldestKey = this.fallbackCache.keys().next().value;
      if (oldestKey) {
        this.fallbackCache.delete(oldestKey);
      }
    }

    this.fallbackCache.set(key, newRecord);

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: newRecord.expiresAt,
      total: limit,
    };
  }
}
