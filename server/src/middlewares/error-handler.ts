import type { NextFunction, Request, Response } from "express";
import { sendError } from "@utils/response-handler.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  sendError(res, 500, "Internal Server Error");
}
