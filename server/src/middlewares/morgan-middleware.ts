import morgan from "morgan";
import { logger } from "@config/logger.js";

// const format = config.env === "production" ? "combined" : "dev";
const format = "dev";

export const morganMiddleware = morgan(format, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});
