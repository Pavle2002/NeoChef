import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@errors/index.js";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    throw new UnauthorizedError("Unauthorized access");
  }
  next();
}
