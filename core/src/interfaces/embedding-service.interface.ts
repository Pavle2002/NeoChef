export interface IEmbeddingService {
  getEmbedding(input: string): Promise<number[]>;
  generateRecommendationEmbeddings(): Promise<void>;
  generateRecipeSimilarityEmbeddings(): Promise<void>;
}
