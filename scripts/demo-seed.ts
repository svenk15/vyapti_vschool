import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

function prepareImportSample(): void {
  const fixturePath = "artifacts/imports-01/private-demo.json";
  const samplePath = "artifacts/imports-01/sample-roster.csv";
  const partialPath = "artifacts/imports-01/sample-roster-partial.csv";
  if (!existsSync(fixturePath)) {
    console.log("IMP-01 sample skipped; its private local academic fixture is not present.");
    return;
  }
  if (existsSync(samplePath)) {
    console.log(`Existing synthetic roster sample preserved: ${samplePath}`);
  }
  const fixture = JSON.parse(readFileSync(fixturePath, "utf8")) as {
    gradeCode?: unknown;
    sectionCode?: unknown;
  };
  if (typeof fixture.gradeCode !== "string" || !/^[A-Za-z0-9_-]{1,20}$/.test(fixture.gradeCode)
    || typeof fixture.sectionCode !== "string" || !/^[A-Za-z0-9_-]{1,20}$/.test(fixture.sectionCode)) {
    throw new Error("SYNTHETIC_IMPORT_FIXTURE_INVALID");
  }
  mkdirSync("artifacts/imports-01", { recursive: true, mode: 0o700 });
  const csv = [
    "external_student_id,student_first_name,admission_number,grade,section,student_last_name,roll_number",
    `SAMPLE-NEW-01,Casey,DEMO-ROSTER-001,${fixture.gradeCode},${fixture.sectionCode},Example,0007`,
    `SAMPLE-INVALID-02,Riley,DEMO-ROSTER-002,${fixture.gradeCode},NO-SUCH-SECTION,Example,`,
  ].join("\n") + "\n";
  if (!existsSync(samplePath)) {
    writeFileSync(samplePath, csv, { flag: "wx", mode: 0o600 });
    console.log(`Created fictional roster upload sample: ${samplePath}`);
  }
  if (!existsSync(partialPath)) {
    const rows = Array.from({ length: 28 }, (_, index) => {
      const number = String(index + 1).padStart(3, "0");
      return `PARTIAL-${number},Taylor,DEMO-PARTIAL-${number},${fixture.gradeCode},${fixture.sectionCode},Sample,${number}`;
    });
    writeFileSync(partialPath, ["external_student_id,student_first_name,admission_number,grade,section,student_last_name,roll_number", ...rows].join("\n") + "\n", { flag: "wx", mode: 0o600 });
    console.log(`Created fictional multi-batch cancellation sample: ${partialPath}`);
  } else console.log(`Existing synthetic partial-import sample preserved: ${partialPath}`);
}

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
  prepareImportSample();

  console.log("\nPrivate demo file locations (credentials/tokens/sample; values are never printed):");
  console.log("- artifacts/iam-01/private-demo.json");
  console.log("- artifacts/iam-03/private-demo.json");
  console.log("- artifacts/iam-03/private-activation.json");
  if (existsSync("artifacts/imports-01/sample-roster.csv")) console.log("- artifacts/imports-01/sample-roster.csv");
  if (existsSync("artifacts/imports-01/sample-roster-partial.csv")) console.log("- artifacts/imports-01/sample-roster-partial.csv");
  console.log("Other feature command receipts and synthetic IDs remain in their ignored artifacts/<task>/ files.");
  console.log("Attendance remains unreleased; IAM-03 acceptance remains pending; PER-02 is not enabled by this command.");
}

try {
  main();
} catch {
  console.error("DEMO_SEED_REFUSED: configure the guarded local vyapti_vschool development database first.");
  process.exitCode = 1;
}
