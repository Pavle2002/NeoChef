import { jobController } from "@controllers/job-controller.js";
import { isAdmin } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { jobSchemas } from "@validation/job-schemas.js";
import { Router } from "express";

const router = Router();

const { startFetchJob } = jobController;
const { startFetchJobSchema } = jobSchemas;

router.post("/fetch", isAdmin, validate(startFetchJobSchema), startFetchJob);

export { router as jobRoutes };
