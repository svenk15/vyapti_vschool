import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["test/unit/**/*.test.ts"],
    environment: "node",
    reporters: ["default", "junit"],
    outputFile: { junit: "artifacts/unit.junit.xml" },
  },
});
