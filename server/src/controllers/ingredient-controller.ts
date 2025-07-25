import { ingredientService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getAll(req: Request, res: Response): Promise<void> {
  const queryString = req.validated?.query?.q as string;
  const ingredients = await ingredientService.getAll(queryString);
  sendSuccess(res, 200, ingredients, "Ingredients retrieved successfully");
}

export const ingredientController = {
  getAll,
};
