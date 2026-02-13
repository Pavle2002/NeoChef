import type { IEmbeddingService } from "../interfaces/embedding-service.interface.js";
import { EmbeddingServiceError } from "../errors/embedding-service-error.js";

export type Candidate = {
  id: string;
  embedding: number[];
};

export class EmbeddingService implements IEmbeddingService {
  constructor(private embedderUrl: string) {}

  async generateEmbedding(input: string): Promise<number[]> {
    const response = await fetch(`${this.embedderUrl}/embed`, {
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
