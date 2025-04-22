import type { ApiResponse } from "@app-types/api-response.js";
import type { ErrorCode } from "@app-types/error-codes.js";
import type { Response } from "express";

export function sendSuccess<T>(
  res: Response<ApiResponse<T>>,
  statusCode: number,
  data: T | null,
  message: string
): void {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(
  res: Response<ApiResponse<null>>,
  statusCode: number,
  message: string,
  errorCode: ErrorCode
): void {
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errorCode,
  });
}
