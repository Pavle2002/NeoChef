import type { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "@neochef/common";
import { UnauthorizedError } from "@errors/unauthorized-error.js";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Session Expired", ErrorCodes.AUTH_EXPIRED);
  }
  next();
}
