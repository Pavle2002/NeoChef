import type { Cuisine } from "@neochef/common";

export interface ICuisineService {
  getAll(): Promise<Cuisine[]>;
}
