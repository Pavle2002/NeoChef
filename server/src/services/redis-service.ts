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
}
