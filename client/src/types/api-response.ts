import { ErrorCode } from "@/types/error-code";

type SuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

type FailResponse = {
  success: false;
  errorCode: ErrorCode;
  message: string;
};

export type ApiResponse<T> = SuccessResponse<T> | FailResponse;
