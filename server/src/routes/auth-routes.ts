import { Router } from "express";
import { passport } from "@config/index.js";
import { authController } from "@controllers/index.js";

const { login, register } = authController;

const router = Router();

router.post("/login", passport.authenticate("local"), login);
router.post("/register", register);

export default router;
