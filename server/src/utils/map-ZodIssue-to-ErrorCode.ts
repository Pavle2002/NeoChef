import { ErrorCodes, type ErrorCode } from "@utils/error-codes.js";
import { ZodIssueCode, type ZodIssue } from "zod";

export function mapZodIssueToErrorCode(issue: ZodIssue): ErrorCode {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      return issue.received === undefined
        ? ErrorCodes.VAL_MISSING_FIELD
        : ErrorCodes.VAL_INVALID_TYPE;
    case ZodIssueCode.unrecognized_keys:
      return ErrorCodes.VAL_INVALID_FORMAT;
    default:
      return ErrorCodes.VAL_FAILED;
  }
}
