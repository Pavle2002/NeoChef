import type { Cuisine } from "./cuisine";
import type { Diet } from "./diet";
import type { Ingredient } from "./ingredient";

export type Preferences = {
  dislikesIngredients: Ingredient[];
  prefersCuisines: Cuisine[];
  followsDiets: Diet[];
};
