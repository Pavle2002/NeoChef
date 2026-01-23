import type { ExtendedRecipe } from "@neochef/common";

export type FetchJob = {
  page: number;
  pageSize: number;
};

export type TransformJob = {
  rawData: any;
};

export type UpsertJob = {
  recipe: ExtendedRecipe;
};
