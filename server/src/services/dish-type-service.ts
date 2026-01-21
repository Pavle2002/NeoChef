import type { DishType } from "@neochef/common";
import type { IDishTypeService } from "@interfaces/dish-type-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait, type IDishTypeRepository } from "@neochef/core";
import type { RedisClientType } from "redis";

export class DishTypeService implements IDishTypeService {
  constructor(
    private readonly dishTypeRepository: IDishTypeRepository,
    private readonly redisClient: RedisClientType<any, any, any>,
  ) {}

  async getAll(): Promise<DishType[]> {
    const cacheKey = CacheKeys.DISH_TYPES_ALL;
    const [error, cached] = await safeAwait(this.redisClient.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as DishType[];
    }

    const dishTypes = await this.dishTypeRepository.findAll();
    await safeAwait(
      this.redisClient.setEx(
        cacheKey,
        CacheKeys.TTL_REF,
        JSON.stringify(dishTypes),
      ),
    );

    return dishTypes;
  }
}
