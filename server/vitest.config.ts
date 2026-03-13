import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globalSetup: "./test/global-setup.ts",
    setupFiles: ["./test/setup.ts"],
    include: ["test/integration/*.test.ts"],
    fileParallelism: false,
  },
});
