import { createDriver, safeAwait } from "@neochef/core";
import { config } from "./config.js";
import { logger } from "./logger.js";

const {
  neo4j: { url, username, password },
} = config;

export const neo4jClient = createDriver(url, username, password);

const [error, serverInfo] = await safeAwait(neo4jClient.getServerInfo());

if (error) {
  logger.error(error);
  await neo4jClient.close();
  throw new Error("Neo4j connection failed");
}

logger.info("Connected to Neo4j database", { ...serverInfo });
