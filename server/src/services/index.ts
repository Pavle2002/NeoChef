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
  EmbeddingService,
  getFetchQueue,
  getTransformQueue,
  getUpsertQueue,
  IngredientRepository,
  QUEUES,
  RecipeRepository,
  RecommendationRepository,
  S3StorageService,
  UnitOfWorkFactory,
  UserRepository,
} from "@neochef/core";
import { config } from "@config/config.js";
import { QueueEvents } from "bullmq";
import { r2Client } from "@config/r2.js";

const queryExecutor = new DriverQueryExecutor(neo4jClient);
const unitOfWorkFactory = new UnitOfWorkFactory(neo4jClient);

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
export const embeddingService = new EmbeddingService(config.embedderUrl);
export const recipeService = new RecipeService(
  recipeRepository,
  redisClient,
  embeddingService,
);
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
export const storageService = new S3StorageService(
  r2Client,
  config.r2.bucketName,
);

const connection = { host: "redis", port: 6379 };

export const fetchQueue = getFetchQueue(connection);
export const transformQueue = getTransformQueue(connection);
export const upsertQueue = getUpsertQueue(connection);

export const fetchEvents = new QueueEvents(QUEUES.FETCH, { connection });
export const transformEvents = new QueueEvents(QUEUES.TRANSFORM, {
  connection,
});
export const upsertEvents = new QueueEvents(QUEUES.UPSERT, { connection });
