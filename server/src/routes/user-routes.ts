import { userController } from "@controllers/user-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { userSchemas } from "@schemas/user-schemas.js";
import { Router } from "express";

const { getCurrentUser, getById, getCurrentUserPreferences } = userController;
const { getByIdSchema } = userSchemas;

const router = Router();

router.get("/me/preferences", isAuthenticated, getCurrentUserPreferences);
router.get("/me", getCurrentUser);
router.get("/:id", isAuthenticated, validate(getByIdSchema), getById);

export { router as userRoutes };
