import { ingredientController } from "@controllers/ingredient-controller.js";
import { isAdmin, isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { ingredientSchemas } from "@validation/ingredient-schemas.js";
import { Router } from "express";

const router = Router();

const { getAllCanonical, getAllUnmapped } = ingredientController;
const { getAllSchema } = ingredientSchemas;

router.get("/", isAuthenticated, validate(getAllSchema), getAllCanonical);
router.get("/unmapped", isAdmin, getAllUnmapped);

export { router as ingredientRoutes };
