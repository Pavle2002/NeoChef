import type { FetchJob, TransformJob } from "@neochef/common";
import { getFetchQueue, getTransformQueue, QUEUES } from "@neochef/core";
import { sendSuccess } from "@utils/response-handler.js";
import { QueueEvents } from "bullmq";
import type { Response, Request } from "express";
import { randomUUID } from "node:crypto";

const connection = { host: "redis", port: 6379 };
const fetchQueue = getFetchQueue(connection);
const transformQueue = getTransformQueue(connection);

const fetchEvents = new QueueEvents(QUEUES.FETCH, { connection });
const transformEvents = new QueueEvents(QUEUES.TRANSFORM, { connection });
const upsertEvents = new QueueEvents(QUEUES.UPSERT, { connection });

async function startFetchJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as FetchJob;
  const correlationId = randomUUID();

  await fetchQueue.add("fetch-job", { correlationId, page });
  sendSuccess(res, 200, correlationId, "Fetch job started successfully");
}

async function startTransformJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as TransformJob;
  const correlationId = randomUUID();

  await transformQueue.add("transform-job", { correlationId, page });
  sendSuccess(res, 200, correlationId, "Transform job started successfully");
}

async function streamEvents(req: Request, res: Response): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const completedHandler = ({ jobId }: { jobId: string }) => {
    res.write(`data: ${JSON.stringify({ type: "completed", jobId })}\n\n`);
  };
  const failedHandler = ({ jobId }: { jobId: string }) => {
    res.write(`data: ${JSON.stringify({ type: "failed", jobId })}\n\n`);
  };

  fetchEvents.on("completed", completedHandler);
  fetchEvents.on("failed", failedHandler);
  transformEvents.on("completed", completedHandler);
  transformEvents.on("failed", failedHandler);
  upsertEvents.on("completed", completedHandler);
  upsertEvents.on("failed", failedHandler);

  req.on("close", () => {
    fetchEvents.off("completed", completedHandler);
    fetchEvents.off("failed", failedHandler);
    transformEvents.off("completed", completedHandler);
    transformEvents.off("failed", failedHandler);
    upsertEvents.off("completed", completedHandler);
    upsertEvents.off("failed", failedHandler);
    res.end();
  });
}

export const jobController = {
  startFetchJob,
  startTransformJob,
  streamEvents,
};
