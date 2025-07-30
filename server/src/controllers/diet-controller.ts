import { dietService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Response, Request } from "express";

async function getAll(req: Request, res: Response): Promise<void> {
  const diets = await dietService.getAll();
  sendSuccess(res, 200, diets, "Diets retrieved successfully");
}

export const dietController = {
  getAll,
};
