import { type Request, type Response } from "express";
import { authService } from "@services/index.js";
import type { UserInput } from "@models/index.js";
import { sendError, sendSuccess } from "@utils/response-handler.js";

function login(req: Request, res: Response): void {
  sendSuccess(res, 200, req.user, "Login successful");
}

async function register(req: Request, res: Response): Promise<void> {
  const user = await authService.registerUser(req.body as UserInput);
  sendSuccess(res, 201, user, "User registered successfully");
}

async function logout(req: Request, res: Response): Promise<void> {
  console.log("Logout user");
  req.logout((err) => {
    if (err) {
      return sendError(res, 500, "Logout failed");
    }
    req.session.destroy((err) => {
      if (err) {
        return sendError(res, 500, "Session destruction failed");
      }
      res.clearCookie("neochef.sid", { path: "/" });
      return sendSuccess(res, 200, null, "Logout successful");
    });
  });
}

export default {
  register,
  login,
  logout,
};
