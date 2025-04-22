export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NetworkError extends Error {
  constructor() {
    super("Ooops! Something went wrong");
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
