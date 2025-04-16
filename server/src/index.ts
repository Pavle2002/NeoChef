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

// const result = await fetch(
//   "https://api.spoonacular.com/recipes/716431/information?apiKey=ba4f73ce06a1448791d0e6d3a3f58d6a&includeNutrition=false"
//   //`https://api.spoonacular.com/food/ingredients/9266/information?apiKey=ba4f73ce06a1448791d0e6d3a3f58d6a&unit=g&amount=100`
//   //`https://api.spoonacular.com/recipes/complexSearch?apiKey=ba4f73ce06a1448791d0e6d3a3f58d6a&addRecipeInformation=${true}&addRecipeNutrition=${true}&number=${1}`
// );
// const data = await result.json();

// console.dir(data, { depth: null });
