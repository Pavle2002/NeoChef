import { recipeController } from "@controllers/recipe-controller.js";
import { validate } from "@middlewares/validation-middleware.js";
import { recipeSchemas } from "@validation/recipe-schemas.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { Router } from "express";

const { getById, getAll, getTrending } = recipeController;
const { getByIdSchema, getAllSchema } = recipeSchemas;

const router = Router();

router.use(isAuthenticated);
router.get("/", validate(getAllSchema), getAll);
router.get("/trending", getTrending);
router.get("/:id", validate(getByIdSchema), getById);

export { router as recipeRoutes };
