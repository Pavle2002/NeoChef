import type { Diet } from "@neochef/common";

export interface IDietRepository {
  findAll(): Promise<Diet[]>;
  create(diet: Diet): Promise<Diet>;
}
