import { ingredientController } from "@controllers/ingredient-controller.js";
import { isAdmin, isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { ingredientSchemas } from "@validation/ingredient-schemas.js";
import { Router } from "express";

const router = Router();

const { getAllCanonical, getAllUnmapped, getSimilarCanonical } =
  ingredientController;
const { getAllCanonicalSchema, getSimilarCanonicalSchema } = ingredientSchemas;

router.get(
  "/",
  isAuthenticated,
  validate(getAllCanonicalSchema),
  getAllCanonical,
);
router.get("/unmapped", isAdmin, getAllUnmapped);
router.get(
  "/similar/:id",
  isAdmin,
  validate(getSimilarCanonicalSchema),
  getSimilarCanonical,
);
export { router as ingredientRoutes };
