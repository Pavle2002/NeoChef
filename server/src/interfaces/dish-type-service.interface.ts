import type { DishType } from "@neochef/common";

export interface IDishTypeService {
  getAll(): Promise<DishType[]>;
}
