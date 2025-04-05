import cors from "cors";
import config from "@config/config.js";

const { env, clientOrigin } = config;

const corsConfig = cors({
  origin: env === "production" ? clientOrigin : "http://localhost:5173",
  credentials: true,
});

export default corsConfig;
