import type { Diet } from "@common/schemas/diet.js";

export interface IDietService {
  getAll(): Promise<Diet[]>;
}
