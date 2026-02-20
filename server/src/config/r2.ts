import { createR2Client } from "@neochef/core";
import { config } from "./config.js";

const { accountId, accessKeyId, secretAccessKey } = config.r2;

export const r2Client = createR2Client(accountId, accessKeyId, secretAccessKey);
