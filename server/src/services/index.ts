import { neo4jClient } from "@config/neo4j.js";
import { AuthService } from "@services/auth-service.js";
import { UserService } from "./user-service.js";
import { RecipeService } from "./recipe-service.js";
import { IngredientService } from "./ingredient-service.js";
import { DietService } from "./diet-service.js";
import { CuisineService } from "./cuisine-service.js";
import { DishTypeService } from "./dish-type-service.js";
import { RecommendationService } from "./recommendation-service.js";
import { redisClient } from "@config/redis.js";
import { RedisRateLimitService } from "./redis-rate-limit-service.js";
import {
  CuisineRepository,
  DietRepository,
  DishTypeRepository,
  DriverQueryExecutor,
  ensureConstraints,
  IngredientRepository,
  RecipeRepository,
  RecommendationRepository,
  UnitOfWorkFactory,
  UserRepository,
} from "@neochef/core";

const queryExecutor = new DriverQueryExecutor(neo4jClient);
const unitOfWorkFactory = new UnitOfWorkFactory(neo4jClient);

await ensureConstraints(neo4jClient);

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
  redisClient,
);
export const recipeService = new RecipeService(recipeRepository, redisClient);
export const ingredientService = new IngredientService(ingredientRepository);
export const cuisineService = new CuisineService(
  cuisineRepository,
  redisClient,
);
export const dietService = new DietService(dietRepository, redisClient);
export const dishTypeService = new DishTypeService(
  dishTypeRepository,
  redisClient,
);
export const recommendationService = new RecommendationService(
  recommendationRepository,
  recipeService,
  redisClient,
);
export const rateLimitService = new RedisRateLimitService(redisClient);
