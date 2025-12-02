import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "SESSION_SECRET",
  "NEO4J_URL",
  "NEO4J_USERNAME",
  "NEO4J_PASSWORD",
  "REDIS_URL",
  "CLIENT_ORIGIN",
  "SPOONACULAR_API_KEY",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  clientOrigin: process.env.CLIENT_ORIGIN as string,
  logLevel: process.env.LOG_LEVEL || "info",
  sessionSecret: process.env.SESSION_SECRET as string,
  redis: { url: process.env.REDIS_URL as string },
  neo4j: {
    url: process.env.NEO4J_URL as string,
    username: process.env.NEO4J_USERNAME as string,
    password: process.env.NEO4J_PASSWORD as string,
  },
  spoonacular: {
    baseUrl: process.env.SPOONACULAR_BASE_URL || "https://api.spoonacular.com",
    apiKey: process.env.SPOONACULAR_API_KEY as string,
    importProgressFilePath:
      process.env.IMPORT_PROGRESS_FILE_PATH || "./import-progress.json",
  },
};

export default config;
