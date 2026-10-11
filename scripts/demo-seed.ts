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
  { name: "PER-02 people and teacher eligibility", script: "scripts/demo-people.ts" },
  { name: "ACA-03 offerings and teacher assignments", script: "scripts/demo-academics-03.ts" },
  { name: "STU-03 placements and student archive", script: "scripts/demo-students-03.ts" },
  { name: "ATT-02 submitted attendance and correction base", script: "scripts/demo-attendance-01.ts" },
  { name: "Administrator Today connected review queues", script: "scripts/demo-dashboard.ts" },
  { name: "BRD-02 published synthetic brand", script: "scripts/demo-branding.ts" },
  { name: "SA-38 Admissions intake", script: "scripts/demo-admissions.ts", required: true },
  { name: "TT-01 weekly timetable pattern", script: "scripts/demo-timetable.ts", required: true },
] as const;

function prepareImportSample(): void {
  const fixturePath = "artifacts/imports-01/private-demo.json";
  const samplePath = "artifacts/imports-01/sample-roster-v2.csv";
  const partialPath = "artifacts/imports-01/sample-roster-partial-v2.csv";
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
    "external_student_id,student_first_name,admission_number,admitted_on,grade,section,student_last_name,roll_number",
    `SAMPLE-NEW-01,Casey,DEMO-ROSTER-001,2026-04-01,${fixture.gradeCode},${fixture.sectionCode},Example,0007`,
    `SAMPLE-INVALID-02,Riley,DEMO-ROSTER-002,2026-04-01,${fixture.gradeCode},NO-SUCH-SECTION,Example,`,
  ].join("\n") + "\n";
  if (!existsSync(samplePath)) {
    writeFileSync(samplePath, csv, { flag: "wx", mode: 0o600 });
    console.log(`Created fictional roster upload sample: ${samplePath}`);
  }
  if (!existsSync(partialPath)) {
    const rows = Array.from({ length: 28 }, (_, index) => {
      const number = String(index + 1).padStart(3, "0");
      return `PARTIAL-${number},Taylor,DEMO-PARTIAL-${number},2026-04-01,${fixture.gradeCode},${fixture.sectionCode},Sample,${number}`;
    });
    writeFileSync(partialPath, ["external_student_id,student_first_name,admission_number,admitted_on,grade,section,student_last_name,roll_number", ...rows].join("\n") + "\n", { flag: "wx", mode: 0o600 });
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
      if ('required' in demo && demo.required) {
        console.error(`Stopped at ${demo.name}; earlier successful demo data was preserved.`);
        process.exitCode = result.status ?? 1;
        return;
      }
      console.warn(`${demo.name} refresh was unavailable; its existing records and private artifacts were preserved. Continuing independent demo seeds.`);
    }
  }
  prepareImportSample();

  const attendance = JSON.parse(readFileSync("artifacts/attendance-01/private-demo.json", "utf8")) as { recommendedDate?: unknown; recommendedSessionIds?: unknown };
  if (typeof attendance.recommendedDate !== "string" || !Array.isArray(attendance.recommendedSessionIds) || attendance.recommendedSessionIds.length === 0) {
    throw new Error("SYNTHETIC_CONNECTED_ATTENDANCE_SCENARIO_REQUIRED");
  }

  console.log("\nPrivate demo file locations (credentials/tokens/sample; values are never printed):");
  console.log("- artifacts/iam-01/private-demo.json");
  console.log("- artifacts/iam-03/private-demo.json");
  console.log("- artifacts/iam-03/private-activation.json");
  console.log("- artifacts/people-02/private-demo.json");
  console.log("- artifacts/academics-03/private-demo.json");
  console.log("- artifacts/attendance-01/private-demo.json");
  console.log("- artifacts/dashboard-01/private-demo.json");
  console.log("- artifacts/admissions-01/private-demo.json");
  console.log("- artifacts/timetable-01/private-demo.json");
  console.log("- artifacts/students-03/private-demo.json");
  if (existsSync("artifacts/imports-01/sample-roster-v2.csv")) console.log("- artifacts/imports-01/sample-roster-v2.csv");
  if (existsSync("artifacts/imports-01/sample-roster-partial-v2.csv")) console.log("- artifacts/imports-01/sample-roster-partial-v2.csv");
  console.log(`\nPrimary administrator/teacher credentials: artifacts/people-02/private-demo.json`);
  console.log(`Connected attendance walkthrough date: ${attendance.recommendedDate} (${attendance.recommendedSessionIds.length} assigned sessions)`);
  console.log("Other feature command receipts and synthetic IDs remain in their ignored artifacts/<task>/ files.");
  console.log("Feature access is enabled only for implemented local demos; server release and human acceptance remain tracked per task and reviewed source.");
}

try {
  main();
} catch {
  console.error("DEMO_SEED_REFUSED: configure the guarded local vyapti_vschool development database first.");
  process.exitCode = 1;
}
