import { ErrorCodes, type ErrorCode } from "@common/utils/error-codes.js";
import { AppError } from "@errors/app-error.js";

export class NotFoundError extends AppError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCodes.RES_NOT_FOUND
  ) {
    super(message, 404, errorCode);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
