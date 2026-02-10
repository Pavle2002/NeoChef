import type { NextFunction, Request, Response } from "express";
import { ErrorCodes, type User } from "@neochef/common";
import { UnauthorizedError } from "@errors/unauthorized-error.js";
import { ForbiddenError } from "@errors/forbidden-error.js";

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

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Session Expired", ErrorCodes.AUTH_EXPIRED);
  }
  if (!(req.user as User).isAdmin) {
    throw new ForbiddenError("Admin privileges required");
  }
  next();
}
