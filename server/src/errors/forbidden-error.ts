import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "@neochef/core";

export class ForbiddenError extends AppError {
  constructor(
    message: string,
    erroCode: ErrorCode = ErrorCodes.AUTH_UNAUTHORIZED,
  ) {
    super(message, 403, erroCode);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
