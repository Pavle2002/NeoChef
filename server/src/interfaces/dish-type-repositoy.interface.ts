import type { DishType } from "@common/schemas/dish-type.js";

export interface IDishTypeRepository {
  findAll(): Promise<DishType[]>;
}
