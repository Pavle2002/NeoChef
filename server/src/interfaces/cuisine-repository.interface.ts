import type { Cuisine } from "@models/cuisine.js";

export interface ICuisineRepository {
  findAll(): Promise<Cuisine[]>;
}
