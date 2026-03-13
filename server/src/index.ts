import { logger } from "@config/logger.js";
import { config } from "@config/config.js";
import app from "./app.js";

const port = config.port;

app.listen(port, () => {
  logger.info(`Server is running on port ${port} `);
});
