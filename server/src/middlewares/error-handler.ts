import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "@utils/response-handler.js";
import { AppError } from "@errors/index.js";
import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { mapZodIssueToErrorCode } from "@utils/map-ZodIssue-to-ErrorCode.js";
import { logger } from "@config/index.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(err);

  if (err instanceof ZodError) {
    const message = err.issues[0]?.message || "Validation failed";

    let errorCode: ErrorCode = ErrorCodes.VAL_FAILED;
    if (err.issues[0]) {
      errorCode = mapZodIssueToErrorCode(err.issues[0]);
    }
    return sendError(res, 400, message, errorCode);
  }

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.errorCode);
  }

  return sendError(
    res,
    500,
    "Internal Server Error",
    ErrorCodes.SYS_INTERNAL_ERROR
  );
}
