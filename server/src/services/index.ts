import { AuthService } from "@services/auth-service.js";
import { UserRepository } from "@repositories/user-repository.js";
import { RecipeRepository } from "@repositories/recipe-repository.js";
import { IngredientRepository } from "@repositories/ingrediant-repository.js";
import { SpoonacularImportService } from "@services/spoonacular-import-service.js";
import { SpoonacularApiClient } from "@clients/spoonacular-api-client.js";
import { config } from "@config/index.js";

const userRepository = new UserRepository();
const ingredientRepository = new IngredientRepository();
const recipeRepository = new RecipeRepository(ingredientRepository);
const spoonacularApiClient = new SpoonacularApiClient(
  config.spoonacular.apiKey,
  config.spoonacular.baseUrl
);

export const authService = new AuthService(userRepository);
export const spoonacularImportService = new SpoonacularImportService(
  spoonacularApiClient,
  recipeRepository
);
