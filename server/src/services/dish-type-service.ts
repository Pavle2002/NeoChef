import type { DishType } from "@common/schemas/dish-type.js";
import type { IDishTypeRepository } from "@interfaces/dish-type-repositoy.interface.js";
import type { IDishTypeService } from "@interfaces/dish-type-service.interface.js";

export class DishTypeService implements IDishTypeService {
  constructor(private readonly dishTypeRepository: IDishTypeRepository) {}

  async getAll(): Promise<DishType[]> {
    return this.dishTypeRepository.findAll();
  }
}
