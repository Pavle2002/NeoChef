import { config } from "../config/config.js";
import { EmbeddingServiceError } from "../errors/embedding-service-error.js";

export interface IEmbeddingService {
  generateEmbeddings(input: string[]): Promise<number[][]>;
  loadCandidates(candidates: Candidate[]): Promise<void>;
  findMatches(input: string): Promise<Match[]>;
}

export type Candidate = {
  id: string;
  embedding: number[];
};

export type Match = {
  id: string;
  confidence: number;
};

export class EmbeddingService implements IEmbeddingService {
  private embeddingServiceUrl = config.embeddingServiceUrl;

  async generateEmbeddings(input: string[]): Promise<number[][]> {
    const response = await fetch(`${this.embeddingServiceUrl}/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: input,
      }),
    });
    if (!response.ok) {
      throw new EmbeddingServiceError(
        "Failed to generate embeddings",
        response.status,
      );
    }
    const { embeddings } = (await response.json()) as {
      embeddings: number[][];
    };
    return embeddings;
  }

  async loadCandidates(candidates: Candidate[]): Promise<void> {
    const response = await fetch(`${this.embeddingServiceUrl}/load`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidates: candidates,
      }),
    });
    if (!response.ok) {
      throw new EmbeddingServiceError(
        "Failed to load candidates embeddings",
        response.status,
      );
    }
  }

  async findMatches(input: string): Promise<Match[]> {
    const response = await fetch(`${this.embeddingServiceUrl}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      throw new EmbeddingServiceError(
        "Failed to get embedding for matching",
        response.status,
      );
    }

    const { matches } = (await response.json()) as { matches: Match[] };
    return matches;
  }
}
