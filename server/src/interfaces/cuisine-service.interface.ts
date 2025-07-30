import type { Cuisine } from "@common/schemas/cuisine.js";

export interface ICuisineService {
  getAll(): Promise<Cuisine[]>;
}
