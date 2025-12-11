import type { Equipment } from "@common/schemas/equipment.js";
import type {
  ExtendedRecipe,
  Recipe,
  RecipeData,
  RecipeFilters,
  RecipeSortOptions,
} from "@common/schemas/recipe.js";
import type { Cuisine } from "@common/schemas/cuisine.js";
import type { Diet } from "@common/schemas/diet.js";
import type { DishType } from "@common/schemas/dish-type.js";
import type { IngredientUsage } from "@common/schemas/ingredient.js";

export interface IRecipeRepository {
  createOrUpdate(recipe: RecipeData): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findByIds(ids: string[]): Promise<Recipe[]>;
  findByIdExtended(id: string, userId: string): Promise<ExtendedRecipe | null>;
  findAll(
    limit?: number,
    offset?: number,
    filters?: RecipeFilters,
    sortOptions?: RecipeSortOptions
  ): Promise<Recipe[]>;
  findTrending(): Promise<{ recipe: Recipe; score: number }[]>;
  addIngredient(
    recipeId: string,
    ingredientId: string,
    usage: IngredientUsage
  ): Promise<void>;
  addEquipment(recipeId: string, equipment: Equipment): Promise<void>;
  addCuisine(recipeId: string, cuisine: Cuisine): Promise<void>;
  addDiet(recipeId: string, diet: Diet): Promise<void>;
  addDishType(recipeId: string, dishType: DishType): Promise<void>;
  countAll(filters: RecipeFilters): Promise<number>;
}
