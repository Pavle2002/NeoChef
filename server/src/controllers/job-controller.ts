import { logger } from "@config/logger.js";
import { getQueueEvents, getQueues, QUEUES } from "@neochef/core";
import { storageService, queues, queueEvents } from "@services/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import type { Response, Request } from "express";
import { randomUUID } from "node:crypto";

async function startFetchJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as { page: number };
  const correlationId = randomUUID();

  await queues[QUEUES.FETCH].add("fetch-job", {
    correlationId,
    page,
    type: "Fetch",
  });
  sendSuccess(res, 200, correlationId, "Fetch job started successfully");
}

async function startTransformJob(req: Request, res: Response): Promise<void> {
  const { page } = req.validated!.body as { page: number };
  const correlationId = randomUUID();

  await queues[QUEUES.TRANSFORM].add("transform-job", {
    correlationId,
    page,
    type: "Transform",
  });
  sendSuccess(res, 200, correlationId, "Transform job started successfully");
}

async function startFastRPJob(_req: Request, res: Response): Promise<void> {
  const correlationId = randomUUID();
  const projectionNames = ["recommendations", "similarRecipes"] as const;

  await queues[QUEUES.FASTRP].addBulk(
    projectionNames.map((projectionName) => ({
      name: "fastrp-job",
      data: { correlationId, projectionName, type: "FastRP" },
    })),
  );

  sendSuccess(res, 200, correlationId, "FastRP job started successfully");
}

async function streamEvents(req: Request, res: Response): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const cleanupListeners = addListeners(queues, queueEvents, res);
  logger.info("Client connected, started streaming events");

  req.on("close", () => {
    cleanupListeners();
    logger.info("Client disconnected, stopped streaming events");
    res.end();
  });
}

async function listSavedPages(_req: Request, res: Response): Promise<void> {
  const pages = await storageService.listPages();
  sendSuccess(res, 200, pages, "Pages retrieved successfully");
}

function addListeners(
  queues: ReturnType<typeof getQueues>,
  queueEvents: ReturnType<typeof getQueueEvents>,
  res: Response,
) {
  const listeners: Array<{
    type: "completed" | "failed" | "added" | "active";
    queueName: (typeof QUEUES)[keyof typeof QUEUES];
    handler: ({ jobId }: { jobId: string }) => Promise<void>;
  }> = [];

  const eventTypes = ["completed", "failed", "added", "active"] as const;

  for (const queueName of Object.values(QUEUES)) {
    const queue = queues[queueName];
    const events = queueEvents[queueName];

    for (const type of eventTypes) {
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
      listeners.push({ type, queueName, handler });
    }
  }

  return () => {
    for (const { type, queueName, handler } of listeners) {
      queueEvents[queueName].off(type, handler);
    }
  };
}

export const jobController = {
  startFetchJob,
  startTransformJob,
  startFastRPJob,
  streamEvents,
  listSavedPages,
};
