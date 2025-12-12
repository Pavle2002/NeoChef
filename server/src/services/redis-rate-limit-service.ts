import logger from "@config/logger.js";
import type { RateLimitResult } from "@interfaces/rate-limit-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";
import type { RedisClientType } from "redis";

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
    windowMs: number
  ): Promise<RateLimitResult> {
    const key = `${CacheKeys.RATE_LIMIT}${identifier}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    const multi = this.redisClient.multi();
    multi.zRemRangeByScore(key, 0, windowStart);
    multi.zCard(key);
    multi.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
    multi.expire(key, Math.ceil(windowMs / 1000));

    const [error, results] = await safeAwait(multi.exec());

    if (error || !results) {
      logger.error("Redis rate limit error, using fallback:", error);
      return this.checkLimitFallback(key, limit, windowMs);
    }

    const countBeforeCurrent = results[1] as number;

    const allowed = countBeforeCurrent < limit;

    return {
      allowed,
      remaining: allowed ? Math.max(0, limit - (countBeforeCurrent + 1)) : 0,
      resetAt: now + windowMs,
      total: limit,
    };
  }

  private checkLimitFallback(
    key: string,
    limit: number,
    windowMs: number
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
