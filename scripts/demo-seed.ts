import { spawnSync } from "node:child_process";
import { localAccessConfig } from "./access-local-config";

/**
 * Compose the checked-in, feature-owned synthetic demo provisioners.
 * Each provisioner owns its data and private idempotency/credential files.
 */
const demos = [
  { name: "IAM-01 administrator", script: "scripts/demo-access.ts" },
  { name: "IAM-03 activation", script: "scripts/demo-activation.ts" },
  { name: "TEN-01 institutions and branches", script: "scripts/demo-tenancy.ts" },
  { name: "TEN-02 entitlement contract", script: "scripts/demo-tenancy-modules.ts" },
  { name: "ACA-01 academic access", script: "scripts/demo-academics.ts" },
  { name: "BRD-02 published synthetic brand", script: "scripts/demo-branding.ts" },
] as const;

function main(): void {
  // Fail before starting any child if the configured URL is not the guarded
  // local development database. Individual provisioners repeat their guard.
  localAccessConfig();
  console.log("Preparing synthetic VSchool demos in local vyapti_vschool...");
  for (const demo of demos) {
    console.log(`\n${demo.name}`);
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", demo.script],
      { stdio: "inherit", env: process.env },
    );
    if (result.error || result.status !== 0) {
      console.error(`Stopped at ${demo.name}; earlier successful demo data was preserved.`);
      process.exitCode = result.status ?? 1;
      return;
    }
  }

  console.log("\nPrivate credential/token locations (open locally; values are never printed):");
  console.log("- artifacts/iam-01/private-demo.json");
  console.log("- artifacts/iam-03/private-demo.json");
  console.log("- artifacts/iam-03/private-activation.json");
  console.log("Other feature command receipts and synthetic IDs remain in their ignored artifacts/<task>/ files.");
  console.log("Attendance remains unreleased; IAM-03 acceptance remains pending; PER-02 is not enabled by this command.");
}

try {
  main();
} catch {
  console.error("DEMO_SEED_REFUSED: configure the guarded local vyapti_vschool development database first.");
  process.exitCode = 1;
}
