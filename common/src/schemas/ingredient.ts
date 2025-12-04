import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string(),
  sourceName: z.string(),
  name: z.string(),
  image: z.string(),
  aisle: z.string(),
});

export const IngredientUsageSchema = z.object({
  amount: z.number(),
  unit: z.string(),
  original: z.string(),
});

export const ExtendedIngredientSchema = z.object({
  ingredient: IngredientSchema,
  usage: IngredientUsageSchema,
});

export const IngredientDataSchema = IngredientSchema.omit({
  id: true,
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
