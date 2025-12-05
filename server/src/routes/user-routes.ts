import { userController } from "@controllers/user-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { userSchemas } from "@validation/user-schemas.js";
import { Router } from "express";

const {
  getCurrentUser,
  getById,
  getCurrentUserPreferences,
  updateCurrentUserPreferences,
  getCurrentUserFridge,
  updateCurrentUserFridge,
  getCurrentUserSavedRecipes,
} = userController;

const { getByIdSchema, updatePreferencesSchema, updateFridgeSchema } =
  userSchemas;

const router = Router();

router.get("/me", getCurrentUser);
router.use(isAuthenticated);

router.get("/me/preferences", getCurrentUserPreferences);
router.put(
  "/me/preferences",
  validate(updatePreferencesSchema),
  updateCurrentUserPreferences
);
router.get("/me/fridge", getCurrentUserFridge);
router.put("/me/fridge", validate(updateFridgeSchema), updateCurrentUserFridge);
router.get("/me/saved-recipes", getCurrentUserSavedRecipes);
router.get("/:id", validate(getByIdSchema), getById);

export { router as userRoutes };
