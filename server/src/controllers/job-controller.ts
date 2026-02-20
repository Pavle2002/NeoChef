import { QUEUES } from "@neochef/core";
import {
  fetchEvents,
  fetchQueue,
  storageService,
  transformEvents,
  transformQueue,
  upsertEvents,
  upsertQueue,
} from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Response, Request } from "express";
import { randomUUID } from "node:crypto";

async function startFetchJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as { page: number };
  const correlationId = randomUUID();

  await fetchQueue.add("fetch-job", {
    correlationId,
    page,
    type: "Fetch",
  });
  sendSuccess(res, 200, correlationId, "Fetch job started successfully");
}

async function startTransformJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as { page: number };
  const correlationId = randomUUID();

  await transformQueue.add("transform-job", {
    correlationId,
    page,
    type: "Transform",
  });
  sendSuccess(res, 200, correlationId, "Transform job started successfully");
}

async function streamEvents(req: Request, res: Response): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const fetchCompletedHandler = addListener(QUEUES.FETCH, "completed", res);
  const fetchFailedHandler = addListener(QUEUES.FETCH, "failed", res);
  const transformCompletedHandler = addListener(
    QUEUES.TRANSFORM,
    "completed",
    res,
  );
  const transformFailedHandler = addListener(QUEUES.TRANSFORM, "failed", res);
  const upsertCompletedHandler = addListener(QUEUES.UPSERT, "completed", res);
  const upsertFailedHandler = addListener(QUEUES.UPSERT, "failed", res);

  req.on("close", () => {
    fetchEvents.off("completed", fetchCompletedHandler);
    fetchEvents.off("failed", fetchFailedHandler);
    transformEvents.off("completed", transformCompletedHandler);
    transformEvents.off("failed", transformFailedHandler);
    upsertEvents.off("completed", upsertCompletedHandler);
    upsertEvents.off("failed", upsertFailedHandler);
    console.log("Client disconnected, stopped streaming events");
    res.end();
  });
}

async function listSavedPages(req: Request, res: Response): Promise<void> {
  const pages = await storageService.listPages();
  sendSuccess(res, 200, pages, "Pages retrieved successfully");
}

function addListener(
  queueName: (typeof QUEUES)[keyof typeof QUEUES],
  type: "completed" | "failed",
  res: Response,
) {
  const events = getQueueEventsByName(queueName);
  const queue = getQueueByName(queueName);

  const handler = async ({ jobId }: { jobId: string }) => {
    const job = await queue.getJob(jobId);
    res.write(
      `data: ${JSON.stringify({
        type,
        job: job?.toJSON(),
      })}\n\n`,
    );
  };
  events.on(type, handler);
  return handler;
}

function getQueueByName(queueName: (typeof QUEUES)[keyof typeof QUEUES]) {
  switch (queueName) {
    case QUEUES.FETCH:
      return fetchQueue;
    case QUEUES.TRANSFORM:
      return transformQueue;
    case QUEUES.UPSERT:
      return upsertQueue;
    default:
      throw new Error("Invalid queue name");
  }
}

function getQueueEventsByName(queueName: (typeof QUEUES)[keyof typeof QUEUES]) {
  switch (queueName) {
    case QUEUES.FETCH:
      return fetchEvents;
    case QUEUES.TRANSFORM:
      return transformEvents;
    case QUEUES.UPSERT:
      return upsertEvents;
    default:
      throw new Error("Invalid queue name");
  }
}

export const jobController = {
  startFetchJob,
  startTransformJob,
  streamEvents,
  listSavedPages,
};
