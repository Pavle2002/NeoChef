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

async function getSimilarCanonical(req: Request, res: Response): Promise<void> {
  const limit = req.validated?.query?.limit as number;
  const ingredientId = req.validated?.params?.id as string;

  const similarIngredients = await ingredientService.getSimilarCanonical(
    ingredientId,
    limit,
  );
  sendSuccess(
    res,
    200,
    similarIngredients,
    "Similar canonical ingredients retrieved successfully",
  );
}

async function addCanonical(req: Request, res: Response): Promise<void> {
  const ingredientId = req.validated?.params?.id as string;
  const canonicalId = req.validated?.body?.canonicalId as string;
  const confidence = req.validated?.body?.confidence as number;

  await ingredientService.addCanonical(ingredientId, canonicalId, confidence);
  sendSuccess(
    res,
    200,
    null,
    "Canonical ingredient mapping added successfully",
  );
}

export const ingredientController = {
  getAllCanonical,
  getAllUnmapped,
  getSimilarCanonical,
  addCanonical,
};
