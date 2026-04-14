import type {
  FastRPJob,
  FetchJob,
  TransformJob,
  UpsertJob,
} from "@neochef/common";
import { Queue, QueueEvents } from "bullmq";

export const QUEUES = {
  FETCH: "fetch-queue",
  TRANSFORM: "transform-queue",
  UPSERT: "upsert-queue",
  FASTRP: "fastrp-queue",
} as const;

export type QueueConnection = {
  host: string;
  port: number;
};

export function getQueues(connection: QueueConnection) {
  return {
    [QUEUES.FETCH]: getFetchQueue(connection),
    [QUEUES.TRANSFORM]: getTransformQueue(connection),
    [QUEUES.UPSERT]: getUpsertQueue(connection),
    [QUEUES.FASTRP]: getFastRPQueue(connection),
  } as const;
}

export function getQueueEvents(connection: QueueConnection) {
  return {
    [QUEUES.FETCH]: new QueueEvents(QUEUES.FETCH, { connection }),
    [QUEUES.TRANSFORM]: new QueueEvents(QUEUES.TRANSFORM, { connection }),
    [QUEUES.UPSERT]: new QueueEvents(QUEUES.UPSERT, { connection }),
    [QUEUES.FASTRP]: new QueueEvents(QUEUES.FASTRP, { connection }),
  } as const;
}

function getFetchQueue(connection: QueueConnection) {
  return new Queue<FetchJob>(QUEUES.FETCH, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: { age: 60 },
      removeOnFail: false,
    },
  });
}

function getTransformQueue(connection: QueueConnection) {
  return new Queue<TransformJob>(QUEUES.TRANSFORM, {
    connection,
    defaultJobOptions: {
      removeOnComplete: { age: 60 },
      removeOnFail: false,
    },
  });
}

function getUpsertQueue(connection: QueueConnection) {
  return new Queue<UpsertJob>(QUEUES.UPSERT, {
    connection,
    defaultJobOptions: {
      attempts: 5,
      removeOnComplete: { age: 60 },
      removeOnFail: false,
    },
  });
}

function getFastRPQueue(connection: QueueConnection) {
  return new Queue<FastRPJob>(QUEUES.FASTRP, {
    connection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
}
