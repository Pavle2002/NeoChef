import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "@utils/response-handler.js";
import { AppError } from "@errors/index.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors
      .map((error) => `${error.message}`)
      .join(". ");

    return sendError(res, 400, formattedErrors);
  }

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  return sendError(res, 500, "Internal Server Error");
}
