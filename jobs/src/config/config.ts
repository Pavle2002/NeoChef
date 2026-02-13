import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "NEO4J_URL",
  "NEO4J_USERNAME",
  "NEO4J_PASSWORD",
  "REDIS_URL",
  "REDIS_PORT",
  "SPOONACULAR_API_KEY",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "EMBEDDER_URL",
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
  r2: {
    accountId: process.env.R2_ACCOUNT_ID as string,
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    bucketName: process.env.R2_BUCKET_NAME as string,
  },
  embedderUrl: process.env.EMBEDDER_URL as string,
};
