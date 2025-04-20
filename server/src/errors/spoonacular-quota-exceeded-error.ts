import { AppError } from "./app-error.js";

export class SpoonacularQuotaExceededError extends AppError {
  constructor(message: string) {
    super(message, 402);
    Object.setPrototypeOf(this, SpoonacularQuotaExceededError.prototype);
  }
}
