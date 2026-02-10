import type { FetchJob, TransformJob, UpsertJob } from "@neochef/common";
import { Queue } from "bullmq";

export const QUEUES = {
  FETCH: "fetch-queue",
  TRANSFORM: "transform-queue",
  UPSERT: "upsert-queue",
} as const;

export type QueueConnection = {
  host: string;
  port: number;
};

export function getFetchQueue(connection: QueueConnection) {
  return new Queue<FetchJob>(QUEUES.FETCH, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
}

export function getTransformQueue(connection: QueueConnection) {
  return new Queue<TransformJob>(QUEUES.TRANSFORM, {
    connection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
}

export function getUpsertQueue(connection: QueueConnection) {
  return new Queue<UpsertJob>(QUEUES.UPSERT, {
    connection,
    defaultJobOptions: {
      attempts: 5,
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
}
