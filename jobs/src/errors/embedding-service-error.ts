import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "@neochef/core";

export class EmbeddingServiceError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode = ErrorCodes.EMB_SERVICE_ERROR,
  ) {
    super(message, statusCode, errorCode);
    Object.setPrototypeOf(this, EmbeddingServiceError.prototype);
  }
}
