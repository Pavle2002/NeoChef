import { Router } from "express";
import { authController } from "@controllers/auth-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { authSchemas } from "@validation/auth-schemas.js";

const { login, register, logout } = authController;
const { loginSchema, registerSchema } = authSchemas;

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/logout", isAuthenticated, logout);

export { router as authRoutes };
