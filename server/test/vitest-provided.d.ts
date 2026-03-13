import "vitest";

declare module "vitest" {
  interface ProvidedContext {
    NEO4J_URL: string;
    NEO4J_USERNAME: string;
    NEO4J_PASSWORD: string;
    REDIS_URL: string;
    REDIS_PORT: string;
    EMBEDDER_URL: string;
  }
}
