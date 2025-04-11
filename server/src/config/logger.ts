import winston from "winston";
import { config } from "@config/index.js";

const { combine, timestamp, json, printf, colorize, errors } = winston.format;
const { Console, File } = winston.transports;

const myFormat = printf(({ level, message, stack }) => {
  return `[${level}]- ${message} ${stack ? "\n" + stack : ""}`;
});

const customLevels = {
  levels: {
    debug: 4,
    http: 3,
    info: 2,
    warn: 1,
    error: 0,
  },
  colors: {
    debug: "blue",
    http: "magenta",
    info: "green",
    warn: "yellow",
    error: "red",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: config.logLevel,
  format: combine(
    timestamp(),
    errors({ stack: config.env === "development" }),
    json()
  ),
});

if (config.env === "production") {
  logger.add(
    new File({
      filename: "logs/combined.log",
      level: "info",
    })
  );
  logger.add(
    new File({
      filename: "logs/error.log",
      level: "error",
    })
  );
} else {
  logger.add(
    new Console({
      format: combine(colorize(), myFormat),
    })
  );
}

export default logger;
