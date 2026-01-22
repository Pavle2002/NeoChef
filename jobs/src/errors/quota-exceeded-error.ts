import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "@neochef/core";

export class QuotaExceededError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCodes.API_QUOTA) {
    super(message, 402, errorCode);
    Object.setPrototypeOf(this, QuotaExceededError.prototype);
  }
}
