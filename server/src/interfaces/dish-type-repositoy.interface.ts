import type { DishType } from "@neochef/common";

export interface IDishTypeRepository {
  findAll(): Promise<DishType[]>;
}
