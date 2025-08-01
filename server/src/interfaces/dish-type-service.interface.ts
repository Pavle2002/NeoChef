import type { DishType } from "@common/schemas/dish-type.js";

export interface IDishTypeService {
  getAll(): Promise<DishType[]>;
}
