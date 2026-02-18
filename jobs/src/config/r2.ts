import { config } from "./config.js";
import { createR2Client } from "@neochef/core";

export const r2Client = createR2Client(
  config.r2.accountId,
  config.r2.accessKeyId,
  config.r2.secretAccessKey,
);

export const R2_BUCKET = config.r2.bucketName;
