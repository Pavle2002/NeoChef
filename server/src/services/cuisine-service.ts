import type { Cuisine } from "@neochef/common";
import type { ICacheService } from "@interfaces/cache-service.interface.js";
import type { ICuisineRepository } from "@interfaces/cuisine-repository.interface.js";
import type { ICuisineService } from "@interfaces/cuisine-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";

export class CuisineService implements ICuisineService {
  constructor(
    private readonly cuisineRepository: ICuisineRepository,
    private readonly cacheService: ICacheService
  ) {}

  async getAll(): Promise<Cuisine[]> {
    const cacheKey = CacheKeys.CUISINES_ALL;
    const [error, cached] = await safeAwait(this.cacheService.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as Cuisine[];
    }

    const cuisines = await this.cuisineRepository.findAll();
    await safeAwait(
      this.cacheService.setEx(
        cacheKey,
        CacheKeys.TTL_REF,
        JSON.stringify(cuisines)
      )
    );

    return cuisines;
  }
}
