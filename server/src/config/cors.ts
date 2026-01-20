import cors from "cors";
import { config } from "./config.js";

const { clientOrigin } = config;

export const corsConfig = cors({
  origin: clientOrigin,
  credentials: true,
  exposedHeaders: [
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
});
