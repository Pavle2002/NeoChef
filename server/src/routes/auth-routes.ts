import { Router } from "express";
import { authController } from "@controllers/auth-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { loginSchema, registerSchema } from "@schemas/auth-schemas.js";

const { login, register, logout, getCurrentUser } = authController;

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getCurrentUser);

export { router as authRoutes };
