import { dietController } from "@controllers/diet-controller.js";
import { isAuthenticated } from "@middlewares/auth-middleware.js";
import { Router } from "express";

const router = Router();

const { getAll } = dietController;

router.get("/", isAuthenticated, getAll);

export { router as dietRoutes };
