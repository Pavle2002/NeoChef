import { jobController } from "@controllers/job-controller.js";
import { isAdmin } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { jobSchemas } from "@validation/job-schemas.js";
import { Router } from "express";

const router = Router();

const { startFetchJob, startTransformJob, streamEvents, listSavedPages } =
  jobController;
const { startFetchJobSchema, startTransformJobSchema } = jobSchemas;

router.post("/fetch", isAdmin, validate(startFetchJobSchema), startFetchJob);
router.post(
  "/transform",
  isAdmin,
  validate(startTransformJobSchema),
  startTransformJob,
);
router.get("/events", streamEvents);
router.get("/pages", listSavedPages);

export { router as jobRoutes };
