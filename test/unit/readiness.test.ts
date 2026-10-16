import { describe, it, expect } from "vitest";
import { describeReadiness } from "../../backend/modules/platform/domain/readiness";
import { querySetupStatus } from "../../backend/modules/platform/application/get-setup-status";
describe("truthful setup status", () => {
  it("does not report ready before database and seed verification", () => {
    for (const state of [
      "not_configured",
      "unavailable",
      "schema_missing",
      "seed_missing",
    ] as const)
      expect(describeReadiness(state).ready).toBe(false);
  });
  it("reports ready only after the adapter confirms the marker", async () =>
    expect(
      (await querySetupStatus({ inspect: async () => "ready" })).ready,
    ).toBe(true));
  it("never exposes connection secrets from provider errors", async () => {
    const result = await querySetupStatus({
      inspect: async () => {
        throw new Error("postgresql://secret-password@private-host/db");
      },
    });
    expect(result.state).toBe("unavailable");
    expect(JSON.stringify(result)).not.toContain("secret-password");
  });
});
