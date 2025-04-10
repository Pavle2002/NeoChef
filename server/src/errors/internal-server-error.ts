import { AppError } from "@errors/app-error.js";

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
