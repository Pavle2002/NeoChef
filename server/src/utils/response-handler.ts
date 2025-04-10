import type { ApiResponse } from "@app-types/api-response.js";
import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T | null,
  message: string
): void {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  } as ApiResponse<T>);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string
): void {
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
  } as ApiResponse<null>);
}
