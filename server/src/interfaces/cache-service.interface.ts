export interface ICacheService {
  get(key: string): Promise<string | null>;
  setEx(key: string, seconds: number, value: string): Promise<string | null>;
  del(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<boolean>;
  zRange(key: string, start: number, stop: number): Promise<string[]>;
  zAdd(key: string, score: number, member: string): Promise<number>;
  zIncrBy(key: string, increment: number, member: string): Promise<number>;
}
