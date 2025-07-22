import type { Cuisine } from "./cuisine.js";
import type { Diet } from "./diet.js";
import type { Ingredient } from "./ingredient.js";

export type Preferences = {
  dislikesIngredients: Ingredient[];
  prefersCuisines: Cuisine[];
  followsDiets: Diet[];
};
