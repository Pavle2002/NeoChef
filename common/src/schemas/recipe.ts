import { z } from "zod";
import { ExtendedIngredientDataSchema } from "./ingredient.js";
import { ExtendedIngredientSchema } from "./ingredient.js";
import { CuisineSchema } from "./cuisine.js";
import { DietSchema } from "./diet.js";
import { EquipmentSchema } from "./equipment.js";
import { DishTypeSchema } from "./dish-type.js";

export const DEFAULT_PAGE_SIZE = 24;
export const DEFAULT_SORT_BY = "score";
export const DEFAULT_SORT_ORDER = "desc";
export const SORT_BY_OPTIONS = [
  "score",
  "createdAt",
  "likeCount",
  "healthScore",
  "readyInMinutes",
  "caloriesPerServing",
] as const;
export const SORT_ORDER_OPTIONS = ["asc", "desc"] as const;

export const RecipeSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string(),
  sourceName: z.string(),
  title: z.string().trim(),
  imageType: z.string(),
  servings: z.number(),
  embedding: z.array(z.number()),
  instructions: z.array(z.string().trim()).optional().default([]),
  summary: z.string().trim().nullish().default(null),
  readyInMinutes: z.number().nullish().default(null),
  weightPerServing: z.number().nullish().default(null),
  caloriesPerServing: z.number().nullish().default(null),
  pricePerServing: z.number().nullish().default(null),
  percentProtein: z.number().nullish().default(null),
  percentFat: z.number().nullish().default(null),
  percentCarbs: z.number().nullish().default(null),
  healthScore: z.number().nullish().default(null),
  createdAt: z.date(),
  likeCount: z.number(),
});

export const ExtendedRecipeSchema = z.object({
  recipe: RecipeSchema.extend({ isLiked: z.boolean(), isSaved: z.boolean() }),
  extendedIngredients: z.array(ExtendedIngredientSchema),
  diets: z.array(DietSchema).optional().default([]),
  cuisines: z.array(CuisineSchema).optional().default([]),
  equipment: z.array(EquipmentSchema).optional().default([]),
  dishTypes: z.array(DishTypeSchema).optional().default([]),
});

export const RecipeDataSchema = RecipeSchema.omit({
  id: true,
  createdAt: true,
  likeCount: true,
});

export const ExtendedRecipeDataSchema = z.object({
  recipeData: RecipeDataSchema,
  extendedIngredients: z.array(ExtendedIngredientDataSchema),
  diets: z.array(DietSchema).optional().default([]),
  cuisines: z.array(CuisineSchema).optional().default([]),
  equipment: z.array(EquipmentSchema).optional().default([]),
  dishTypes: z.array(DishTypeSchema).optional().default([]),
});

export const RecipeFiltersSchema = z.object({
  cuisines: z.array(z.string()).optional(),
  diets: z.array(z.string()).optional(),
  dishTypes: z.array(z.string()).optional(),
});

export const RecipeSortOptionsSchema = z.object({
  sortBy: z.enum(SORT_BY_OPTIONS).default(DEFAULT_SORT_BY),
  sortOrder: z.enum(SORT_ORDER_OPTIONS).default(DEFAULT_SORT_ORDER),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type ExtendedRecipe = z.infer<typeof ExtendedRecipeSchema>;
export type RecipeData = z.infer<typeof RecipeDataSchema>;
export type ExtendedRecipeData = z.infer<typeof ExtendedRecipeDataSchema>;
export type RecipeFilters = z.infer<typeof RecipeFiltersSchema>;
export type RecipeSortOptions = z.infer<typeof RecipeSortOptionsSchema>;
