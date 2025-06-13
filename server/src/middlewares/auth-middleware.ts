import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@errors/index.js";
import { ErrorCodes } from "@utils/error-codes.js";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Session Expired", ErrorCodes.AUTH_EXPIRED);
  }
  next();
}
