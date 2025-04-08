import { type Request, type Response } from "express";
import { authService } from "@services/index.js";
import type { UserInput } from "@models/index.js";

function login(req: Request, res: Response): void {
  res.status(200).send({ message: "Login successful", user: req.user });
}

async function register(req: Request, res: Response): Promise<void> {
  const user = await authService.registerUser(req.body as UserInput);
  res.status(201).send({ message: "User registered successfully", user });
}

export const authController = {
  login,
  register,
};
