import { cuisineController } from "@controllers/cuisine-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { Router } from "express";

const router = Router();

const { getAll } = cuisineController;

router.get("/", isAuthenticated, getAll);

export { router as cuisineRoutes };
