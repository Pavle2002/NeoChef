import type { Recipe } from "@models/recipe.js";

export type RecipeData = Omit<Recipe, "id">;
