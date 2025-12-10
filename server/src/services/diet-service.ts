import type { Diet } from "@common/schemas/diet.js";
import type { ICacheService } from "@interfaces/cache-service.interface.js";
import type { IDietRepository } from "@interfaces/diet-repository.interface.js";
import type { IDietService } from "@interfaces/diet-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";

export class DietService implements IDietService {
  constructor(
    private readonly dietRepository: IDietRepository,
    private readonly cacheService: ICacheService
  ) {}

  async getAll(): Promise<Diet[]> {
    const cacheKey = CacheKeys.DIETS_ALL;
    const [error, cached] = await safeAwait(this.cacheService.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as Diet[];
    }

    const diets = await this.dietRepository.findAll();
    await safeAwait(
      this.cacheService.setEx(
        cacheKey,
        CacheKeys.TTL_REF,
        JSON.stringify(diets)
      )
    );

    return diets;
  }
}
