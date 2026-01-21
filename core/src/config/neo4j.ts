import neo4j from "neo4j-driver";

export function createNeo4jClient(
  url: string,
  username: string,
  password: string,
) {
  const client = neo4j.driver(url, neo4j.auth.basic(username, password), {
    disableLosslessIntegers: true,
  });
  return client;
}
