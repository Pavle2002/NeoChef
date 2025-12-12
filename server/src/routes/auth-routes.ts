import { Router } from "express";
import { authController } from "@controllers/auth-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { authSchemas } from "@validation/auth-schemas.js";
import { rateLimiter } from "@middlewares/rate-limiter.js";
import { config } from "@config/index.js";

const { login, register, logout } = authController;
const { loginSchema, registerSchema } = authSchemas;

const router = Router();

const { login: loginLimit, register: registerLimit } = config.rateLimit;

const loginLimiter = rateLimiter(
  loginLimit.maxRequests,
  loginLimit.windowMs,
  "login"
);
const registerLimiter = rateLimiter(
  registerLimit.maxRequests,
  registerLimit.windowMs,
  "register"
);

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/logout", isAuthenticated, logout);

export { router as authRoutes };
