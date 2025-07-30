import type { Cuisine } from "@common/schemas/cuisine.js";

export interface ICuisineRepository {
  findAll(): Promise<Cuisine[]>;
}
