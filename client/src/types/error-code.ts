export const ErrorCodes = {
  AUTH_001: {
    NAME: "AUTH_INVALID",
    USER_MESSAGE: "Invalid email or password. Please try again.",
  } as const,

  VAL_001: {
    NAME: "VAL_FAILED",
    USER_MESSAGE: "Validation failed. Please check your input.",
  } as const,
  VAL_002: {
    NAME: "VAL_INVALID_TYPE",
    USER_MESSAGE: "Invalid data type provided.",
  } as const,
  VAL_003: {
    NAME: "VAL_INVALID_FORMAT",
    USER_MESSAGE: "Invalid format. Please follow the required format.",
  } as const,
  VAL_004: {
    NAME: "VAL_MISSING_FIELD",
    USER_MESSAGE: "A required field is missing. Please fill in all fields.",
  } as const,

  RES_001: {
    NAME: "RES_NOT_FOUND",
    USER_MESSAGE: "The requested resource was not found.",
  } as const,
  RES_002: {
    NAME: "RES_CONFLICT",
    USER_MESSAGE: "A conflict occurred. Please try again.",
  } as const,
  RES_003: {
    NAME: "RES_CONFLICT_EMAIL",
    USER_MESSAGE: "Account with this email already exists.",
  } as const,
  RES_004: {
    NAME: "RES_CONFLICT_USERNAME",
    USER_MESSAGE:
      "This username is already taken. Please choose another username.",
  } as const,

  EXT_001: {
    NAME: "API_ERROR",
    USER_MESSAGE: "An external API error occurred. Please try again later.",
  } as const,
  EXT_002: {
    NAME: "API_QUOTA",
    USER_MESSAGE: "API quota exceeded. Please wait and try again later.",
  } as const,

  SYS_001: {
    NAME: "SYS_INTERNAL_ERROR",
    USER_MESSAGE: "An internal system error occurred. Please contact support.",
  } as const,
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
export type ErrorCodeObject = (typeof ErrorCodes)[keyof typeof ErrorCodes];
