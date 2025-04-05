import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "NEO4J_URL",
  "NEO4J_USERNAME",
  "NEO4J_PASSWORD",
  "REDIS_URL",
  "CLIENT_ORIGIN",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Export configuration
const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  clientOrigin: process.env.CLIENT_ORIGIN as string,
  sessionSecret: process.env.SESSION_SECRET || "default_secret",
  redis: { url: process.env.REDIS_URL as string },
  neo4j: {
    url: process.env.NEO4J_URL as string,
    username: process.env.NEO4J_USERNAME as string,
    password: process.env.NEO4J_PASSWORD as string,
  },
};

export default config;
