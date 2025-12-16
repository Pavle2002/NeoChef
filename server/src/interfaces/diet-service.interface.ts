import type { Diet } from "@neochef/common";

export interface IDietService {
  getAll(): Promise<Diet[]>;
}
