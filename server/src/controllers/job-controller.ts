import type { FetchJob } from "@neochef/common";
import { getFetchQueue } from "@neochef/core";
import { sendSuccess } from "@utils/response-handler.js";
import type { Response, Request } from "express";

const connection = { host: "redis", port: 6379 };
const fetchQueue = getFetchQueue(connection);
const transformQueue = getFetchQueue(connection);

async function startFetchJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as FetchJob;

  const job = await fetchQueue.add("fetch-job", { page });
  sendSuccess(res, 200, job.id, "Fetch job started successfully");
}

export const jobController = {
  startFetchJob,
};
