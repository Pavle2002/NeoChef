import { config } from "../config/config.js";
import { EmbeddingServiceError } from "../errors/embedding-service-error.js";

export interface IEmbeddingService {
  generateEmbedding(input: string): Promise<number[]>;
}

export type Candidate = {
  id: string;
  embedding: number[];
};

export class EmbeddingService implements IEmbeddingService {
  private embeddingServiceUrl = config.embeddingServiceUrl;

  async generateEmbedding(input: string): Promise<number[]> {
    const response = await fetch(`${this.embeddingServiceUrl}/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input,
      }),
    });
    if (!response.ok) {
      throw new EmbeddingServiceError(
        "Failed to generate embedding",
        response.status,
      );
    }
    const { embedding } = (await response.json()) as {
      embedding: number[];
    };
    return embedding;
  }
}
