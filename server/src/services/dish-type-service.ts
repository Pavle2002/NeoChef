import type { DishType } from "@common/schemas/dish-type.js";
import type { ICacheService } from "@interfaces/cache-service.interface.js";
import type { IDishTypeRepository } from "@interfaces/dish-type-repositoy.interface.js";
import type { IDishTypeService } from "@interfaces/dish-type-service.interface.js";
import { CacheKeys } from "@utils/cache-keys.js";
import { safeAwait } from "@utils/safe-await.js";

export class DishTypeService implements IDishTypeService {
  constructor(
    private readonly dishTypeRepository: IDishTypeRepository,
    private readonly cacheService: ICacheService
  ) {}

  async getAll(): Promise<DishType[]> {
    const cacheKey = CacheKeys.DISH_TYPES_ALL;
    const [error, cached] = await safeAwait(this.cacheService.get(cacheKey));
    if (!error && cached) {
      return JSON.parse(cached) as DishType[];
    }

    const dishTypes = await this.dishTypeRepository.findAll();
    await safeAwait(
      this.cacheService.setEx(
        cacheKey,
        CacheKeys.TTL_REF,
        JSON.stringify(dishTypes)
      )
    );

    return dishTypes;
  }
}
