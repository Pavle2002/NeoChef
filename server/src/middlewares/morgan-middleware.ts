import morgan from "morgan";
import { logger } from "@config/index.js";
import { config } from "@config/index.js";

const format = config.env === "production" ? "combined" : "dev";

export const morganMiddleware = morgan(format, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});
