import type { Cuisine } from "@neochef/common";

export interface ICuisineRepository {
  findAll(): Promise<Cuisine[]>;
  create(cuisine: Cuisine): Promise<Cuisine>;
}
