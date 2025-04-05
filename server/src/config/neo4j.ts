import neo4j from "neo4j-driver";
import config from "@config/config.js";
import { safeAwait } from "@utils/helpers.js";

const { url, username, password } = config.neo4j;

const neo4jClient = neo4j.driver(url, neo4j.auth.basic(username, password));

const [serverInfo, error] = await safeAwait(neo4jClient.getServerInfo());

if (error) {
  console.error("Failed to connect to Neo4j database:", error);
  await neo4jClient.close();
  throw new Error("Neo4j connection failed");
}

console.log("Connected to Neo4j database:", serverInfo);

export default neo4jClient;
