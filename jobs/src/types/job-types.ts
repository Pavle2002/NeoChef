import type { ExtendedRecipeData } from "@neochef/common";

export type FetchJob = {
  page: number;
};

export type TransformJob = {
  page: number;
};

export type UpsertJob = {
  recipes: ExtendedRecipeData[];
};
