import type { ErrorCode } from "@app-types/error-codes.js";

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  errorCode?: ErrorCode;
};
