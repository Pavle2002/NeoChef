import { cuisineService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Response, Request } from "express";

async function getAll(req: Request, res: Response): Promise<void> {
  const cuisines = await cuisineService.getAll();
  sendSuccess(res, 200, cuisines, "Cuisines retrieved successfully");
}

export const cuisineController = {
  getAll,
};
