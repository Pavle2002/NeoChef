import type { ExtendedRecipe } from "@neochef/common";

export type FetchJob = {
  page: number;
  pageSize: number;
};

export type NormalizeJob = {
  recipeId: string;
};

export type UpsertJob = {
  recipe: ExtendedRecipe;
};
