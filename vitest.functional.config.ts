import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["test/functional/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 60000,
    reporters: ["default", "junit"],
    outputFile: { junit: "artifacts/functional.junit.xml" },
  },
});
