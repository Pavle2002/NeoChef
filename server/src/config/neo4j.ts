import neo4j from "neo4j-driver";
import { safeAwait } from "@utils/safe-await.js";
import { config } from "./config.js";
import { logger } from "./logger.js";

const { url, username, password } = config.neo4j;

export const neo4jClient = neo4j.driver(
  url,
  neo4j.auth.basic(username, password),
  {
    disableLosslessIntegers: true,
  },
);

const [error, serverInfo] = await safeAwait(neo4jClient.getServerInfo());

if (error) {
  logger.error(error);
  await neo4jClient.close();
  throw new Error("Neo4j connection failed");
}

logger.info("Connected to Neo4j database", { ...serverInfo });
