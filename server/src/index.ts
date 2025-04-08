import express, { type Request, type Response } from "express";
import { config, sessionConfig, corsConfig, passport } from "@config/index.js";
import { authRoutes } from "@routes/index.js";
import { sendSuccess } from "@utils/response-handler.js";
import { errorHandler, isAuthenticated } from "@middlewares/index.js";

const app = express();
const port = config.port;

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
  console.log(`Server is running on http://localhost:${port}`);
});
