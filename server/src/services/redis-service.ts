import type { RedisClientType } from "redis";
import type { ICacheService } from "@interfaces/cache-service.interface.js";

export class RedisService implements ICacheService {
  constructor(private readonly redisClient: RedisClientType<any, any, any>) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async setEx(
    key: string,
    seconds: number,
    value: string
  ): Promise<string | null> {
    return this.redisClient.setEx(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async zAdd(key: string, score: number, member: string): Promise<number> {
    return this.redisClient.zAdd(key, { score, value: member });
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.zRange(key, start, stop, { REV: true });
  }

  async zIncrBy(
    key: string,
    increment: number,
    member: string
  ): Promise<number> {
    return this.redisClient.zIncrBy(key, increment, member);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return this.redisClient.expire(key, seconds);
  }
}
