import { ingredientController } from "@controllers/ingredient-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { ingredientSchemas } from "@validation/ingredient-schemas.js";
import { Router } from "express";

const router = Router();

const { getAll } = ingredientController;
const { getAllSchema } = ingredientSchemas;

router.get("/", isAuthenticated, validate(getAllSchema), getAll);

export { router as ingredientRoutes };
