import { jobController } from "@controllers/job-controller.js";
import { isAdmin } from "@middlewares/auth-middleware.js";
import { validate } from "@middlewares/validation-middleware.js";
import { jobSchemas } from "@validation/job-schemas.js";
import { Router } from "express";

const router = Router();

router.use(isAdmin);

const {
  startFetchJob,
  startTransformJob,
  startFastRPJob,
  streamEvents,
  listSavedPages,
} = jobController;
const { startFetchJobSchema, startTransformJobSchema } = jobSchemas;

router.post("/fetch", validate(startFetchJobSchema), startFetchJob);
router.post("/transform", validate(startTransformJobSchema), startTransformJob);
router.post("/fastrp", startFastRPJob);
router.get("/events", streamEvents);
router.get("/pages", listSavedPages);

export { router as jobRoutes };
