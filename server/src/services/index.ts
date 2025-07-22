import { AuthService } from "@services/auth-service.js";
import { UserRepository } from "@repositories/user-repository.js";
import { RecipeRepository } from "@repositories/recipe-repository.js";
import { IngredientRepository } from "@repositories/ingrediant-repository.js";
import { SpoonacularImportService } from "@services/spoonacular-import-service.js";
import { SpoonacularApiClient } from "@clients/spoonacular-api-client.js";
import { config } from "@config/index.js";
import { FileImportProgressManager } from "./file-import-progress-manager.js";
import { DriverQueryExecutor } from "@utils/driver-query-executor.js";
import neo4jClient from "@config/neo4j.js";
import { UnitOfWorkFactory } from "@utils/unit-of-work-factory.js";
import { UserService } from "./user-service.js";
import { RecipeService } from "./recipe-service.js";

const queryExecutor = new DriverQueryExecutor(neo4jClient);
const unitOfWorkFactory = new UnitOfWorkFactory(neo4jClient);

const userRepository = new UserRepository(queryExecutor);
const ingredientRepository = new IngredientRepository(queryExecutor);
const recipeRepository = new RecipeRepository(queryExecutor);

export const authService = new AuthService(userRepository);
export const userService = new UserService(userRepository, unitOfWorkFactory);
export const recipeService = new RecipeService(recipeRepository);

const spoonacularApiClient = new SpoonacularApiClient(
  config.spoonacular.apiKey,
  config.spoonacular.baseUrl
);
const fileImportProgressManager = new FileImportProgressManager(
  config.spoonacular.importProgressFilePath
);

export const spoonacularImportService = new SpoonacularImportService(
  spoonacularApiClient,
  unitOfWorkFactory,
  fileImportProgressManager
);
