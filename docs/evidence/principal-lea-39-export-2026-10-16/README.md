# LEA-39 Principal aggregate export evidence

Status: Attendance coverage export slice engineering-verified; full LEA-39 partial; human review pending.

## Authority and data boundary

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow LEA-39.
- Production route: `/leadership/reports`; direct private route: `/api/v1/leadership/reports/attendance.csv`.
- Source projection: Attendance `register-coverage.v1`. Reporting calls its owner port and never queries Attendance tables.
- `vs_reporting_export_grant` is a separate operator-designated branch authority. It is not created by the Principal role.
- The CSV has one summary row and at most 50 already-visible awaiting-register rows. It refuses overflow and excludes pupil/private facts.
- Migrations `20261016140000_reporting_export_grant` and additive `20261016141000_reporting_export_grant_metadata` are applied to development and test; both retain 66 forward migrations. The applied table migration was not rewritten.

## Verification

- `pnpm test:unit test/unit/reporting-export.test.ts`: 7/7 passed, including quote/formula neutralization and no-silent-truncation behavior.
- `pnpm test:functional test/functional/attendance-sessions.test.ts`: 12/12 passed against real `vyapti_vschool_test`, including no automatic export grant, operator grant/revoke, cross-scope denial, source aggregate consistency, safe ExportRun/audit metadata and sensitive-field exclusion.
- Focused Playwright with one worker: 2/2 Chromium and 2/2 mobile passed sequentially. It verified Reports navigation, field/scope preview, no overflow, direct download filename/content, exclusion of pupil facts, mobile drawer focus return and the immutable LEA-39 reference state.
- `pnpm exec tsx scripts/demo-principal-attendance.ts`: passed against guarded local development PostgreSQL and preserved the fictional Principal export designation and scenario.
- `pnpm check`: passed, including 35 unit files / 166 unit tests, documentation validation, the 97-table database-design registry, boundaries and backend extraction checks.
- `pnpm build`: passed from the same source after both forward migrations were applied. The resulting route inventory includes `/leadership/reports` and `/api/v1/leadership/reports/attendance.csv`.
- A focused migration-compatibility rerun used Vitest `-t` after an unsupported `--grep` invocation was rejected before test execution; the corrected run passed 1/1 against the 66-migration test schema.

## Direct visual inspection

- `application-chromium.png` and `reference-chromium.png`: inspected at 1440×1000.
- `application-mobile.png` and `reference-mobile.png`: inspected at 390×844.
- The application uses the approved Principal shell, clear report scope/as-of, three aggregate cards, allowlisted field preview, explicit exclusions, bound status and one primary download action. Desktop alignment and mobile stacking were readable without horizontal overflow.
- The approved source is a workflow-review dialog, while the production page is the narrow real-data workflow composition. This is a bounded design extension rather than identical screen fidelity. The documented font portability exception remains; native VoiceOver/NVDA was not executed.

## Remaining work

Full LEA-39 remains partial. Assignment completion, feedback turnaround, timetable exception and notice coverage need equivalent owner export ports and disclosure verification before they can be exported. Human review, TEN-03 and production gates remain pending.
