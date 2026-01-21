import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "@neochef/core";

export class UnauthorizedError extends AppError {
  constructor(message: string, erroCode: ErrorCode = ErrorCodes.AUTH_INVALID) {
    super(message, 401, erroCode);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
