import type { Cuisine } from "@neochef/common";
import type { ICuisineService } from "@interfaces/cuisine-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait, type ICuisineRepository } from "@neochef/core";
import type { RedisClientType } from "redis";

export class CuisineService implements ICuisineService {
  constructor(
    private readonly cuisineRepository: ICuisineRepository,
    private readonly redisClient: RedisClientType<any, any, any>,
  ) {}

  async getAll(): Promise<Cuisine[]> {
    const cacheKey = CacheKeys.CUISINES_ALL;
    const [error, cached] = await safeAwait(this.redisClient.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as Cuisine[];
    }

    const cuisines = await this.cuisineRepository.findAll();
    await safeAwait(
      this.redisClient.setEx(
        cacheKey,
        CacheKeys.TTL_REF,
        JSON.stringify(cuisines),
      ),
    );

    return cuisines;
  }
}
