import type { ErrorCode } from "@neochef/common";

export class AppError extends Error {
  readonly statusCode: number;
  readonly errorCode: ErrorCode;

  constructor(message: string, statusCode: number, errorCode: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
