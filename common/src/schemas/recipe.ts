import { z } from "zod";
import { ExtendedIngredientDataSchema } from "./ingredient.js";
import { ExtendedIngredientSchema } from "./ingredient.js";
import { CuisineSchema } from "./cuisine.js";
import { DietSchema } from "./diet.js";
import { EquipmentSchema } from "./equipment.js";
import { DishTypeSchema } from "./dish-type.js";

export const DEFAULT_PAGE_SIZE = 24;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER = "desc";
export const SORT_BY_OPTIONS = [
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
  title: z.string(),
  imageType: z.string(),
  spoonacularScore: z.number().optional(),
  healthScore: z.number().optional(),
  servings: z.number(),
  weightPerServing: z.number(),
  pricePerServing: z.number(),
  caloriesPerServing: z.number().optional(),
  readyInMinutes: z.number(),
  instructions: z.array(z.string()),
  summary: z.string(),
  percentProtein: z.number().optional(),
  percentFat: z.number().optional(),
  percentCarbs: z.number().optional(),
  createdAt: z.date(),
  likeCount: z.number(),
});

export const ExtendedRecipeSchema = z.object({
  recipe: RecipeSchema.extend({ isLiked: z.boolean(), isSaved: z.boolean() }),
  extendedIngredients: z.array(ExtendedIngredientSchema),
  diets: z.array(DietSchema),
  cuisines: z.array(CuisineSchema),
  equipment: z.array(EquipmentSchema),
  dishTypes: z.array(DishTypeSchema),
});

export const RecipeDataSchema = RecipeSchema.omit({
  id: true,
  createdAt: true,
  likeCount: true,
});

export const ExtendedRecipeDataSchema = z.object({
  recipeData: RecipeDataSchema,
  extendedIngredients: z.array(ExtendedIngredientDataSchema),
  diets: z.array(DietSchema),
  cuisines: z.array(CuisineSchema),
  equipment: z.array(EquipmentSchema),
  dishTypes: z.array(DishTypeSchema),
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
