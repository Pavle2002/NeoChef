export interface IEmbeddingService {
  getEmbedding(input: string): Promise<number[]>;
}
