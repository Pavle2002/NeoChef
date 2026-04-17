import { createNeo4jClient, safeAwait } from "@neochef/core";
import { config } from "./config.js";
import { logger } from "./logger.js";

const {
  neo4j: { url, username, password },
} = config;

export const neo4jClient = await createNeo4jClient(url, username, password);

logger.info("Connected to Neo4j database");
