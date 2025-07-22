import type { Diet } from "@models/diet.js";

export interface IDietRepository {
  findAll(): Promise<Diet[]>;
}
