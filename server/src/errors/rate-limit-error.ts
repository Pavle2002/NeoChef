import { ErrorCodes, type ErrorCode } from "@common/utils/error-codes.js";
import { AppError } from "@errors/app-error.js";

export class RateLimitError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCodes.RL_EXCEEDED) {
    super(message, 429, errorCode);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
