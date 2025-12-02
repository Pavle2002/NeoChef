import { dishTypeController } from "@controllers/dish-type-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { Router } from "express";

const router = Router();

const { getAll } = dishTypeController;

router.get("/", isAuthenticated, getAll);

export { router as dishTypeRoutes };
