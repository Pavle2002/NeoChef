import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "@neochef/core";

export class SpoonacularError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode = ErrorCodes.SPN_API_ERROR,
  ) {
    super(message, statusCode, errorCode);
    Object.setPrototypeOf(this, SpoonacularError.prototype);
  }
}
