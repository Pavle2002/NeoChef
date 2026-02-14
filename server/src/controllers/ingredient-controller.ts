import { ingredientService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Request, Response } from "express";

async function getAllCanonical(req: Request, res: Response): Promise<void> {
  const queryString = req.validated?.query?.q as string;
  const ingredients = await ingredientService.getAllCanonical(queryString);
  sendSuccess(res, 200, ingredients, "Ingredients retrieved successfully");
}

async function getAllUnmapped(req: Request, res: Response): Promise<void> {
  const ingredients = await ingredientService.getAllUnmapped();
  sendSuccess(
    res,
    200,
    ingredients,
    "Unmapped ingredients retrieved successfully",
  );
}

export const ingredientController = {
  getAllCanonical,
  getAllUnmapped,
};
