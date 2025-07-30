import type { Diet } from "@common/schemas/diet.js";

export interface IDietRepository {
  findAll(): Promise<Diet[]>;
}
