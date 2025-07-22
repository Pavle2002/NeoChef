import { Router } from "express";
import { authController } from "@controllers/auth-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { authSchemas } from "@schemas/auth-schemas.js";

const { login, register, logout, getCurrentUser } = authController;
const { loginSchema, registerSchema } = authSchemas;

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/logout", isAuthenticated, logout);
router.get("/me", getCurrentUser);

export { router as authRoutes };
