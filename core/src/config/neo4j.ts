import neo4j from "neo4j-driver";

export function createDriver(url: string, username: string, password: string) {
  const driver = neo4j.driver(url, neo4j.auth.basic(username, password), {
    disableLosslessIntegers: true,
  });
  return driver;
}
