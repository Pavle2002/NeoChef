import { createLogger } from "@neochef/core";
import { config } from "./config.js";

const { env, logLevel } = config;

export const logger = createLogger(logLevel, env);
