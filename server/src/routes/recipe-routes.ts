import { recipeController } from "@controllers/recipe-controller.js";
import { validate } from "@middlewares/validation-middleware.js";
import { recipeSchemas } from "@schemas/recipe-schemas.js";
import { Router } from "express";

const { getById, getAll, getTrending } = recipeController;
const { getByIdSchema, getAllSchema } = recipeSchemas;

const router = Router();

router.get("/", validate(getAllSchema), getAll);
router.get("/trending", getTrending);
router.get("/:id", validate(getByIdSchema), getById);

export { router as recipeRoutes };
