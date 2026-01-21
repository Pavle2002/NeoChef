import { ErrorCodes, type ErrorCode } from "@neochef/common";
import { AppError } from "./app-error.js";

export class ConflictError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCodes.RES_CONFLICT) {
    super(message, 409, errorCode);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
