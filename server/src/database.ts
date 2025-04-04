import neo4j from "neo4j-driver";
import config from "./config.js";
import { safeAwait } from "./utils/helpers.js";

const { uri, username, password } = config.neo4j;

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

const [serverInfo, error] = await safeAwait(driver.getServerInfo());

if (error) {
  console.error("Failed to connect to Neo4j database:", error);
  throw new Error("Database connection failed");
}

console.log("Connected to Neo4j database:", serverInfo);

export default driver;
