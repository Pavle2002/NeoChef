import { spoonacularImportService } from "@services/index.js";
import { logger } from "@config/index.js";
import { SpoonacularQuotaExceededError } from "@errors/spoonacular-quota-exceeded-error.js";
import { safeAwait } from "@utils/safe-await.js";

const batchSize = process.argv[2] ? parseInt(process.argv[2]) : 20;

logger.info("Starting recipe import process", { batchSize });

const [error] = await safeAwait(
  spoonacularImportService.importRecipesInBatches(batchSize)
);

if (error) {
  if (error instanceof SpoonacularQuotaExceededError) {
    logger.warn("Daily quota exceeded, stopping import process");
    process.exit(0);
  }
  logger.error(error);
  process.exit(1);
}

logger.info("Import process completed");
process.exit(0);
