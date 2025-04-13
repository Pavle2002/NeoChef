import { type NextFunction, type Request, type Response } from "express";
import { type AnyZodObject } from "zod";

export function validate(
  schema: AnyZodObject
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.validated = result;
    next();
  };
}
