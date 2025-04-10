import { AppError } from "@errors/app-error.js";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
