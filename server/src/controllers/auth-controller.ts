import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { IVerifyOptions } from "passport-local";
import { authService } from "@services/index.js";
import type { User, UserData } from "@neochef/common";
import { sendSuccess } from "@utils/response-handler.js";
import { UnauthorizedError } from "@errors/unauthorized-error.js";

function login(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate(
    "local",
    (err: Error | null, user: User, info: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new UnauthorizedError(info.message));
      }
      req.logIn(user, (err: Error | null) => {
        if (err) {
          return next(err);
        }
        return sendSuccess(res, 200, user, info.message);
      });
    },
  )(req, res, next);
}

async function register(req: Request, res: Response): Promise<void> {
  const user = await authService.registerUser(req.validated?.body as UserData);
  sendSuccess(res, 201, user, "User registered successfully");
}

async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  req.logout((err: Error | null) => {
    if (err) {
      next(err);
    }
    req.session.destroy((err: Error | null) => {
      if (err) {
        next(err);
      }
      res.clearCookie("neochef.sid", { path: "/" });
      return sendSuccess(res, 200, null, "Logout successful");
    });
  });
}

export const authController = {
  register,
  login,
  logout,
};
