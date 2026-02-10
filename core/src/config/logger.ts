import winston from "winston";

const { combine, timestamp, json, printf, colorize, errors } = winston.format;
const { Console } = winston.transports;

const myFormat = printf(({ level, message, stack }) => {
  return `[${level}] - ${message} ${stack ? "\n" + stack : ""}`;
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

export function createLogger(logLevel: string, env: string) {
  return winston.createLogger({
    levels: customLevels.levels,
    level: logLevel,
    format: combine(
      timestamp(),
      errors({ stack: env === "development" }),
      json(),
    ),
    transports: [
      new Console({
        format: combine(colorize(), myFormat),
      }),
    ],
  });
}
// ------ Log files are not recommended in Docker containers ------ //

// if (env === "production") {
//   logger.add(
//     new File({
//       filename: "logs/combined.log",
//       level: "info",
//     })
//   );
//   logger.add(
//     new File({
//       filename: "logs/error.log",
//       level: "error",
//     })
//   );
// }
