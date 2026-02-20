import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "SESSION_SECRET",
  "NEO4J_URL",
  "NEO4J_USERNAME",
  "NEO4J_PASSWORD",
  "REDIS_URL",
  "REDIS_PORT",
  "CLIENT_ORIGIN",
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
  port: parseInt(process.env.PORT || "3000", 10),
  clientOrigin: process.env.CLIENT_ORIGIN!.split(","),
  logLevel: process.env.LOG_LEVEL || "info",
  sessionSecret: process.env.SESSION_SECRET as string,
  redis: {
    url: process.env.REDIS_URL as string,
    port: parseInt(process.env.REDIS_PORT as string, 10),
  },
  neo4j: {
    url: process.env.NEO4J_URL as string,
    username: process.env.NEO4J_USERNAME as string,
    password: process.env.NEO4J_PASSWORD as string,
  },
  caching_ttls: {
    userSession: parseInt(process.env.USER_SESSION_TTL || "3600", 10), // 1 hour
    trendingRecipes: parseInt(process.env.TRENDING_RECIPES_TTL || "3600", 10), // 15 minutes
    recommendedRecipes: parseInt(
      process.env.RECOMMENDED_RECIPES_TTL || "900",
      10,
    ), // 15 minutes
    filterOptions: parseInt(process.env.FILTER_OPTIONS_TTL || "86400", 10), // 24 hours
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== "false",
    global: {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX || "100", 10),
    },
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_AUTH_MAX || "10", 10),
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: parseInt(process.env.RATE_LIMIT_REGISTER_MAX || "3", 10),
    },
    strict: {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: parseInt(process.env.RATE_LIMIT_STRICT_MAX || "50", 10),
    },
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID as string,
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    bucketName: process.env.R2_BUCKET_NAME as string,
  },
  embedderUrl: process.env.EMBEDDER_URL as string,
};
