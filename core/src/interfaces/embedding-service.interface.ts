export interface IEmbeddingService {
  getEmbedding(input: string): Promise<number[]>;
  createProjection(): Promise<void>;
  runFastRP(): Promise<void>;
}
