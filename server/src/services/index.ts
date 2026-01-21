import { config } from "@config/config.js";
import { neo4jClient } from "@config/neo4j.js";
import { AuthService } from "@services/auth-service.js";
import { SpoonacularImportService } from "@services/spoonacular-import-service.js";
import { SpoonacularApiClient } from "@utils/spoonacular-api-client.js";
import { FileImportProgressManager } from "./file-import-progress-manager.js";
import { UserService } from "./user-service.js";
import { RecipeService } from "./recipe-service.js";
import { IngredientService } from "./ingredient-service.js";
import { DietService } from "./diet-service.js";
import { CuisineService } from "./cuisine-service.js";
import { DishTypeService } from "./dish-type-service.js";
import { RecommendationService } from "./recommendation-service.js";
import { RedisService } from "./redis-service.js";
import { redisClient } from "@config/redis.js";
import { RedisRateLimitService } from "./redis-rate-limit-service.js";
import {
  CuisineRepository,
  DietRepository,
  DishTypeRepository,
  DriverQueryExecutor,
  IngredientRepository,
  RecipeRepository,
  RecommendationRepository,
  UnitOfWorkFactory,
  UserRepository,
} from "@neochef/core";

const queryExecutor = new DriverQueryExecutor(neo4jClient);
const unitOfWorkFactory = new UnitOfWorkFactory(neo4jClient);
const cacheService = new RedisService(redisClient);

const userRepository = new UserRepository(queryExecutor);
const ingredientRepository = new IngredientRepository(queryExecutor);
const recipeRepository = new RecipeRepository(queryExecutor);
const cuisineRepository = new CuisineRepository(queryExecutor);
const dietRepository = new DietRepository(queryExecutor);
const dishTypeRepository = new DishTypeRepository(queryExecutor);
const recommendationRepository = new RecommendationRepository(queryExecutor);

export const authService = new AuthService(userRepository);
export const userService = new UserService(
  userRepository,
  unitOfWorkFactory,
  cacheService,
);
export const recipeService = new RecipeService(recipeRepository, cacheService);
export const ingredientService = new IngredientService(ingredientRepository);
export const cuisineService = new CuisineService(
  cuisineRepository,
  cacheService,
);
export const dietService = new DietService(dietRepository, cacheService);
export const dishTypeService = new DishTypeService(
  dishTypeRepository,
  cacheService,
);
export const recommendationService = new RecommendationService(
  recommendationRepository,
  recipeService,
  cacheService,
);
export const rateLimitService = new RedisRateLimitService(redisClient);

export const spoonacularApiClient = new SpoonacularApiClient(
  config.spoonacular.apiKey,
  config.spoonacular.baseUrl,
);
const fileImportProgressManager = new FileImportProgressManager(
  config.spoonacular.importProgressFilePath,
);

export const spoonacularImportService = new SpoonacularImportService(
  spoonacularApiClient,
  unitOfWorkFactory,
  fileImportProgressManager,
  cacheService,
);
