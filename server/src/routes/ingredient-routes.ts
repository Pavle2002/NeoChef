import { ingredientController } from "@controllers/ingredient-controller.js";
import { isAdmin, isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { ingredientSchemas } from "@validation/ingredient-schemas.js";
import { Router } from "express";

const router = Router();

const { getAllCanonical, getAllUnmapped, getSimilarCanonical, addCanonical } =
  ingredientController;
const { getAllCanonicalSchema, getSimilarCanonicalSchema, addCanonicalSchema } =
  ingredientSchemas;

router.get(
  "/",
  isAuthenticated,
  validate(getAllCanonicalSchema),
  getAllCanonical,
);
router.get("/unmapped", isAdmin, getAllUnmapped);
router.get(
  "/:id/similar",
  isAdmin,
  validate(getSimilarCanonicalSchema),
  getSimilarCanonical,
);
router.post(
  "/:id/mapping",
  isAdmin,
  validate(addCanonicalSchema),
  addCanonical,
);

export { router as ingredientRoutes };
