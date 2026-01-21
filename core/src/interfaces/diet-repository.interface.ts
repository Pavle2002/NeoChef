import type { Diet } from "@neochef/common";

export interface IDietRepository {
  findAll(): Promise<Diet[]>;
}
