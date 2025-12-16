import type { ErrorCode } from "@neochef/common";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: ErrorCode;
  readonly retryAfter?: number;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    retryAfter?: number
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
