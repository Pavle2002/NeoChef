import { Router } from "express";
import { recipeController } from "@controllers/recipe-controller.js";
import { validate } from "@middlewares/validation-middleware.js";
import { recipeSchemas } from "@validation/recipe-schemas.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { recommendationController } from "@controllers/recommendation-controller.js";

const { getById, getAll, getTrending, like, unlike, save, unsave } =
  recipeController;
const { getRecommendedRecipes } = recommendationController;
const { getByIdSchema, getAllSchema } = recipeSchemas;

const router = Router();

router.use(isAuthenticated);
router.get("/", validate(getAllSchema), getAll);
router.get("/trending", getTrending);
router.get("/recommended", getRecommendedRecipes);
router.get("/:id", validate(getByIdSchema), getById);
router.post("/:id/like", validate(getByIdSchema), like);
router.post("/:id/save", validate(getByIdSchema), save);
router.delete("/:id/like", validate(getByIdSchema), unlike);
router.delete("/:id/save", validate(getByIdSchema), unsave);

export { router as recipeRoutes };
