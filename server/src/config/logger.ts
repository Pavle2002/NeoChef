import winston from "winston";
import { config } from "@config/index.js";

const { combine, timestamp, json, printf, colorize } = winston.format;

const myFormat = printf(({ level, message }) => {
  return `[${level}]- ${message}`;
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
  ],
});

if (config.env !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), myFormat),
    })
  );
}

export default logger;
