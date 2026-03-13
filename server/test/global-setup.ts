import { Neo4jContainer, StartedNeo4jContainer } from "@testcontainers/neo4j";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import {
  GenericContainer,
  Wait,
  type StartedTestContainer,
} from "testcontainers";

import { type TestProject } from "vitest/node";

let neo4jContainer: StartedNeo4jContainer;
let redisContainer: StartedRedisContainer;
let embedderContainer: StartedTestContainer;

export async function setup(project: TestProject) {
  const embedderImage = await GenericContainer.fromDockerfile(
    "..",
    "embedder/Dockerfile",
  )
    .withTarget("production")
    .build("embedder:latest", { deleteOnExit: false });

  const [neo4j, redis, embedder] = await Promise.all([
    new Neo4jContainer("neo4j:latest")
      .withName("neo4j")
      .withWaitStrategy(Wait.forListeningPorts())
      .withStartupTimeout(20_000)
      .start(),
    new RedisContainer("redis:alpine").withName("redis").start(),
    embedderImage
      .withName("embedder")
      .withWaitStrategy(Wait.forListeningPorts())
      .withExposedPorts(4000)
      .start(),
  ]);

  neo4jContainer = neo4j;
  redisContainer = redis;
  embedderContainer = embedder;

  project.provide("NEO4J_URL", neo4jContainer.getBoltUri());
  project.provide("NEO4J_USERNAME", neo4jContainer.getUsername());
  project.provide("NEO4J_PASSWORD", neo4jContainer.getPassword());

  project.provide("REDIS_URL", redis.getHost());
  project.provide("REDIS_PORT", String(redis.getMappedPort(6379)));

  project.provide(
    "EMBEDDER_URL",
    `http://${embedder.getHost()}:${embedder.getMappedPort(4000)}`,
  );
}

export async function teardown() {
  await Promise.all([
    redisContainer?.stop(),
    neo4jContainer?.stop(),
    embedderContainer?.stop(),
  ]);
}
