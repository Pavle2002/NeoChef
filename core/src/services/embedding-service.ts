import type { IEmbeddingService } from "../interfaces/embedding-service.interface.js";
import { EmbeddingServiceError } from "../errors/embedding-service-error.js";
import type { GDSService } from "./gds-service.js";

export class EmbeddingService implements IEmbeddingService {
  constructor(
    private readonly embedderUrl: string,
    private readonly gdsService: GDSService,
  ) {}

  async getEmbedding(input: string): Promise<number[]> {
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

  async generateRecommendationEmbeddings(): Promise<void> {
    await this.gdsService.dropProjection("recommendations");
    await this.gdsService.createRecommendationsProjection();
    await this.gdsService.runFastRPOnRecommendationsProjection();
    await this.gdsService.dropProjection("recommendations");
  }

  async generateRecipeSimilarityEmbeddings(): Promise<void> {
    await this.gdsService.dropProjection("recipe-similarity");
    await this.gdsService.createRecipeSimilarityProjection();
    await this.gdsService.runFastRPOnRecipeSimilarityProjection();
    await this.gdsService.dropProjection("recipe-similarity");
  }
}
