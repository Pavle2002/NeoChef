import { z } from "zod";
import { IngredientSchema } from "./ingredient.js";
import { CuisineSchema } from "./cuisine.js";
import { DietSchema } from "./diet.js";
export const PreferencesSchema = z.object({
    dislikesIngredients: z.array(IngredientSchema),
    prefersCuisines: z.array(CuisineSchema),
    followsDiets: z.array(DietSchema),
});
//# sourceMappingURL=preferences.js.map