import { sendError } from "@utils/response-handler.js";
import type { NextFunction, Request, Response } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return sendError(res, 401, "Unauthorized");
}
