import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "./app-error.js";

export class NotFoundError extends AppError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCodes.RES_NOT_FOUND,
  ) {
    super(message, 404, errorCode);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
