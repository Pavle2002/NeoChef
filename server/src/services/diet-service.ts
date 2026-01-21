import type { Diet } from "@neochef/common";
import type { IDietService } from "@interfaces/diet-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait, type IDietRepository } from "@neochef/core";
import type { RedisClientType } from "redis";

export class DietService implements IDietService {
  constructor(
    private readonly dietRepository: IDietRepository,
    private readonly redisClient: RedisClientType<any, any, any>,
  ) {}

  async getAll(): Promise<Diet[]> {
    const cacheKey = CacheKeys.DIETS_ALL;
    const [error, cached] = await safeAwait(this.redisClient.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as Diet[];
    }

    const diets = await this.dietRepository.findAll();
    await safeAwait(
      this.redisClient.setEx(
        cacheKey,
        CacheKeys.TTL_REF,
        JSON.stringify(diets),
      ),
    );

    return diets;
  }
}
