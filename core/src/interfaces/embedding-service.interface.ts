export interface IEmbeddingService {
  generateEmbedding(input: string): Promise<number[]>;
}
