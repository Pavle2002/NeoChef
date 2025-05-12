import { ErrorCode, ErrorCodeObject, ErrorCodes } from "@/types/error-code";

export default class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCodeObject: ErrorCodeObject;

  constructor(message: string, statusCode: number, errorCode: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCodeObject = ErrorCodes[errorCode];
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
