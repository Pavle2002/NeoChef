import z from "zod";
import { ExtendedRecipeDataSchema } from "./recipe.js";

export const FetchJobSchema = z.object({
  type: z.enum(["Fetch"]),
  correlationId: z.string(),
  page: z.number(),
});

export const TransformJobSchema = z.object({
  type: z.enum(["Transform"]),
  correlationId: z.string(),
  page: z.number(),
});

export const UpsertJobSchema = z.object({
  type: z.enum(["Upsert"]),
  correlationId: z.string(),
  extendedRecipeData: ExtendedRecipeDataSchema,
});

export const embeddingPurposeSchema = z.enum([
  "recommendations",
  "recipe-similarity",
]);

export const EmbeddingJobSchema = z.object({
  type: z.enum(["Embedding"]),
  purpose: embeddingPurposeSchema,
  correlationId: z.string(),
});

export type FetchJob = z.infer<typeof FetchJobSchema>;
export type TransformJob = z.infer<typeof TransformJobSchema>;
export type UpsertJob = z.infer<typeof UpsertJobSchema>;
export type EmbeddingJob = z.infer<typeof EmbeddingJobSchema>;
export type EmbeddingPurpose = z.infer<typeof embeddingPurposeSchema>;
