import { ErrorCodes, type ErrorCode } from "@common/utils/error-codes.js";
import { AppError } from "@errors/app-error.js";

export class UnauthorizedError extends AppError {
  constructor(message: string, erroCode: ErrorCode = ErrorCodes.AUTH_INVALID) {
    super(message, 401, erroCode);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
