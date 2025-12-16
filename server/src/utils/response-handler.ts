import type { ErrorCode, FailResponse, SuccessResponse } from "@neochef/common";
import type { Response } from "express";

export function sendSuccess<T>(
  res: Response<SuccessResponse<T>>,
  statusCode: number,
  data: T,
  message: string
): void {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(
  res: Response<FailResponse>,
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
