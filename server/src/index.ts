import express, { type Request, type Response } from "express";
import {
  config,
  sessionConfig,
  corsConfig,
  passport,
  logger,
} from "@config/index.js";
import { authRoutes } from "@routes/auth-routes.js";
import { sendSuccess } from "@utils/response-handler.js";
import { errorHandler } from "@middlewares/error-handler.js";
import { morganMiddleware } from "@middlewares/morgan-middleware.js";

const app = express();
const port = config.port;

app.use(morganMiddleware);
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  sendSuccess(res, 200, null, "Hello World!");
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info("Server is running", { address: `http://localhost:${port}` });
});
