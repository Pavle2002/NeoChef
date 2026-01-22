import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "NEO4J_URL",
  "NEO4J_USERNAME",
  "NEO4J_PASSWORD",
  "REDIS_URL",
  "REDIS_PORT",
  "SPOONACULAR_API_KEY",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const config = {
  env: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  redis: {
    url: process.env.REDIS_URL as string,
    port: parseInt(process.env.REDIS_PORT as string, 10),
  },
  neo4j: {
    url: process.env.NEO4J_URL as string,
    username: process.env.NEO4J_USERNAME as string,
    password: process.env.NEO4J_PASSWORD as string,
  },
  spoonacular: {
    baseUrl: process.env.SPOONACULAR_BASE_URL || "https://api.spoonacular.com",
    apiKey: process.env.SPOONACULAR_API_KEY as string,
  },
};
