import { z } from "zod";
import { version } from "zod/v4/core";

export const CanonicalIngredientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim(),
  category: z.string().trim(),
});

export const IngredientSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string(),
  sourceName: z.string(),
  name: z.string().trim(),
  normalizedName: z.string().trim(),
  image: z.string().nullish().default(null),
  aisle: z.string().nullish().default(null),
});

export const IngredientUsageSchema = z.object({
  amount: z.number(),
  unit: z.string().nullish().default(null),
  original: z.string().nullish().default(null),
});

export const ExtendedIngredientSchema = z.object({
  ingredient: IngredientSchema,
  usage: IngredientUsageSchema,
});

export const IngredientDataSchema = IngredientSchema.omit({
  id: true,
});

export const CanonicalIngredientDataSchema = CanonicalIngredientSchema.omit({
  id: true,
}).extend({
  versions: z.array(z.string()).nullish().default(null),
});

export const ExtendedIngredientDataSchema = z.object({
  ingredientData: IngredientDataSchema,
  usage: IngredientUsageSchema,
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type ExtendedIngredient = z.infer<typeof ExtendedIngredientSchema>;
export type IngredientData = z.infer<typeof IngredientDataSchema>;
export type IngredientUsage = z.infer<typeof IngredientUsageSchema>;
export type ExtendedIngredientData = z.infer<
  typeof ExtendedIngredientDataSchema
>;
export type CanonicalIngredient = z.infer<typeof CanonicalIngredientSchema>;
export type CanonicalIngredientData = z.infer<
  typeof CanonicalIngredientDataSchema
>;
