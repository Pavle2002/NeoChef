import { Router } from "express";
import { passport } from "@config/index.js";
import { authController } from "@controllers/index.js";
import { isAuthenticated } from "@middlewares/index.js";

const { login, register, logout } = authController;

const router = Router();

router.post("/login", passport.authenticate("local"), login);
router.post("/register", register);
router.get("/logout", isAuthenticated, logout);

export default router;
