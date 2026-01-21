import type { User } from "@neochef/common";
import { RateLimitError } from "@errors/rate-limit-error.js";
import { rateLimitService } from "@services/index.js";
import type { Request, Response, NextFunction } from "express";
import { safeAwait } from "@neochef/core";

export const rateLimiter = (
  limit: number,
  windowMs: number,
  actionKey?: string,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = (req.user as User)?.id || req.ip || "unknown";

    const endpoint = actionKey || req.baseUrl || "global";

    const [error, result] = await safeAwait(
      rateLimitService.checkLimit(identifier, endpoint, limit, windowMs),
    );

    if (error) return next();

    res.set("X-RateLimit-Limit", result.total.toString());
    res.set("X-RateLimit-Remaining", result.remaining.toString());
    res.set("X-RateLimit-Reset", Math.ceil(result.resetAt / 1000).toString());

    if (!result.allowed) throw new RateLimitError(`Rate limit exceeded`);

    next();
  };
};
