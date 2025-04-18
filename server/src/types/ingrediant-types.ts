import type { Ingrediant } from "@models/ingrediant.js";

export type IngrediantData = Omit<Ingrediant, "id">;
