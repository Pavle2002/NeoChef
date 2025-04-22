import { ErrorCodes, type ErrorCode } from "@app-types/error-codes.js";
import { AppError } from "@errors/app-error.js";

export class ConflictError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCodes.RES_CONFLICT) {
    super(message, 409, errorCode);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
