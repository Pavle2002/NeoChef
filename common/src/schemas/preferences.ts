import { z } from "zod";
import { CanonicalIngredientSchema } from "./ingredient.js";
import { CuisineSchema } from "./cuisine.js";
import { DietSchema } from "./diet.js";

export const PreferencesSchema = z.object({
  dislikesIngredients: z.array(CanonicalIngredientSchema),
  prefersCuisines: z.array(CuisineSchema),
  followsDiets: z.array(DietSchema),
});

export type Preferences = z.infer<typeof PreferencesSchema>;
