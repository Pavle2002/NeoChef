import { dishTypeService } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Response, Request } from "express";

async function getAll(req: Request, res: Response): Promise<void> {
  const dishTypes = await dishTypeService.getAll();
  sendSuccess(res, 200, dishTypes, "Dish types retrieved successfully");
}

export const dishTypeController = {
  getAll,
};
