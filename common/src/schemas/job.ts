import z from "zod";
import { ExtendedRecipeDataSchema } from "./recipe.js";

export const FetchJobSchema = z.object({
  page: z.number(),
});

export const TransformJobSchema = z.object({
  page: z.number(),
});

export const UpsertJobSchema = z.object({
  extendedRecipeData: ExtendedRecipeDataSchema,
});

export type FetchJob = z.infer<typeof FetchJobSchema>;
export type TransformJob = z.infer<typeof TransformJobSchema>;
export type UpsertJob = z.infer<typeof UpsertJobSchema>;
