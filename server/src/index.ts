import express, { type Request, type Response } from "express";
import { authRoutes } from "@routes/auth-routes.js";
import { sendSuccess } from "@utils/response-handler.js";
import { errorHandler } from "@middlewares/error-handler.js";
import { morganMiddleware } from "@middlewares/morgan-middleware.js";
import { recipeRoutes } from "@routes/recipe-routes.js";
import { userRoutes } from "@routes/user-routes.js";
import { ingredientRoutes } from "@routes/ingredient-routes.js";
import { cuisineRoutes } from "@routes/cuisine-routes.js";
import { dietRoutes } from "@routes/diet-routes.js";
import { dishTypeRoutes } from "@routes/dish-type-routes.js";
import { rateLimiter } from "@middlewares/rate-limiter.js";
import { config } from "@config/config.js";
import { corsConfig } from "@config/cors.js";
import { sessionConfig } from "@config/session.js";
import { logger } from "@config/logger.js";
import { passport } from "@config/passport.js";
import { jobRoutes } from "@routes/job-routes.js";

const app = express();
app.set("trust proxy", 1);
if (config.env === "development") app.disable("etag");
const port = config.port;

const { maxRequests, windowMs } = config.rateLimit.global;

app.use(morganMiddleware);
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(rateLimiter(maxRequests, windowMs));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/cuisines", cuisineRoutes);
app.use("/diets", dietRoutes);
app.use("/dish-types", dishTypeRoutes);
app.use("/jobs", jobRoutes);

app.get("/", (req: Request, res: Response) => {
  sendSuccess(res, 200, null, "Hello World!");
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info("Server is running", { address: `http://localhost:${port}` });
});
