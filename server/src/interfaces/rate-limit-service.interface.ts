export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  total: number;
}

export interface IRateLimitService {
  checkLimit(
    identifier: string,
    endpoint: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult>;
}
