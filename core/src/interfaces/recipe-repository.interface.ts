import type {
  Cuisine,
  Diet,
  DishType,
  Equipment,
  ExtendedRecipe,
  IngredientUsage,
  Recipe,
  RecipeData,
  RecipeFilters,
  RecipeSortOptions,
  SimilarityExplanation,
} from "@neochef/common";

export interface IRecipeRepository {
  create(recipe: RecipeData): Promise<Recipe>;
  findById(id: string): Promise<Recipe | null>;
  findByIds(ids: string[]): Promise<Recipe[]>;
  findByIdExtended(id: string, userId: string): Promise<ExtendedRecipe | null>;
  findAll(
    limit?: number,
    offset?: number,
    filters?: RecipeFilters,
    sortOptions?: RecipeSortOptions,
    searchEmbedding?: number[],
  ): Promise<Recipe[]>;
  findTrending(): Promise<{ recipe: Recipe; score: number }[]>;
  addIngredient(
    recipeId: string,
    ingredientId: string,
    usage: IngredientUsage,
  ): Promise<void>;
  addEquipment(recipeId: string, equipment: Equipment): Promise<void>;
  addCuisine(recipeId: string, cuisine: Cuisine): Promise<void>;
  addDiet(recipeId: string, diet: Diet): Promise<void>;
  addDishType(recipeId: string, dishType: DishType): Promise<void>;
  countAll(filters: RecipeFilters, searchEmbedding?: number[]): Promise<number>;
  findSimilarRecipes(id: string, limit: number): Promise<Recipe[]>;
  findSimilarityExplanation(
    id1: string,
    id2: string,
  ): Promise<SimilarityExplanation>;
}
