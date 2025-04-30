import { ErrorCodes, type ErrorCode } from "@utils/error-codes.js";
import { AppError } from "./app-error.js";

export class SpoonacularQuotaExceededError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCodes.API_QUOTA) {
    super(message, 402, errorCode);
    Object.setPrototypeOf(this, SpoonacularQuotaExceededError.prototype);
  }
}
