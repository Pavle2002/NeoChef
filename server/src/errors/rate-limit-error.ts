import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "@neochef/core";

export class RateLimitError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCodes.RL_EXCEEDED) {
    super(message, 429, errorCode);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
