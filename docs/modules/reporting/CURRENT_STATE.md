# Attendance review, completeness and exports — current state

Last updated: 2026-10-16. Principal completion batch started 08:19 IST; intended handover 16:19 IST.

## LEA-06 retained aggregate snapshots — 16 October 2026

Status: ENGINEERING_VERIFIED / HUMAN_REVIEW_PENDING / REAL_DATA_RELEASE_BLOCKED.

Reporting now owns an operator-designated branch `reporting.snapshot.manage` grant and immutable, bounded `register-coverage.v1` snapshots. Attendance remains the live source owner and is reached only through its authorized application port. Capture records the exact definition, scope, filters, source as-of, capture time, actor and safe aggregate rows; it excludes pupils, rosters, marks, explanations, response/feedback content and raw source rows. Current Principal report-read authority is required for every list/detail read, while capture and explicit payload removal also require the independent manager designation. Capture and removal are exact-key replay safe. Removal nulls the protected payload/hash, retains minimal audit metadata and denies the old detail URL without changing Attendance.

Forward migration `20261016142000_reporting_snapshots` is applied to both `vyapti_vschool` and `vyapti_vschool_test`; 67 migrations are retained. The two Reporting tables are registered as Path A BRANCH tables for TEN-03 closure. Synthetic local/test mode is explicit; the default remains disabled and real-data use is blocked until retention and backup-deletion policy is approved.

Verification: focused unit 9/9; real-PostgreSQL Attendance/Reporting 12/12; one-worker Principal browser 6/6 desktop and 6/6 mobile after correcting one ambiguous test locator; current-source Playwright production build passed. The database tests cover no automatic grant, operator designation/revocation, foreign scope, exact replay/conflict, immutable payload after source mutation, manager revocation with retained read, removal/replay, stale-link denial and safe audit metadata. Direct screenshot inspection covered the immutable retained view and removal confirmation at 1440×1000 and 390×844 against the immutable LEA-06 workflow reference. The approved source is a workflow dialog, while the production Reports pages are a reference-less shared-shell extension; the full-page confirmation captures contain Playwright's stitched fixed-header artifact and are not treated as an application layout state. The guarded incremental seed passed and preserves its private data in ignored `artifacts/leadership-01/private-demo.json`. See [evidence](../../evidence/principal-lea-06-snapshots-2026-10-16/README.md).

Human review, exact font portability, native VoiceOver/NVDA, TEN-03 and production controls remain pending. Real-data snapshot availability remains deliberately disabled.

## LEA-39 Principal Attendance aggregate export — 16 October 2026

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / FULL_WORKFLOW_PARTIAL / HUMAN_REVIEW_PENDING.

Reporting now owns an independent operator-designated branch `reporting.export` grant and a direct export of Attendance-owned `register-coverage.v1`. The export carries the exact date/class/status/Teacher/order predicates, definition and owner as-of, contains one summary plus at most 50 already-visible awaiting-register rows, refuses overflow without truncation and excludes pupils, rosters, marks, explanations, correction history and private content. Generation rechecks the live Principal report-read authority, export designation and Attendance module chain before atomically writing safe ExportRun/Platform audit metadata. CSV bytes are formula-safe, private/no-store and never persisted or exposed through a reusable URL.

Forward migrations `20261016140000_reporting_export_grant` and additive `20261016141000_reporting_export_grant_metadata` are applied to both designated local databases; 66 migrations are retained. The second migration adds the canonical Path A closure metadata without rewriting the applied table migration. The new BRANCH table is registered for TEN-03 closure. Focused unit passed 7/7 and real-PostgreSQL Attendance/Reporting passed 12/12, covering no automatic Principal grant, operator designation/revocation, cross-scope denial, owner-total/row consistency and sensitive-field exclusion. Sequential one-worker Playwright passed 2/2 desktop and 2/2 mobile; the matched captures were directly inspected against the immutable LEA-39 workflow dialog. `pnpm exec tsx scripts/demo-principal-attendance.ts` passed and preserves the connected export persona in ignored `artifacts/leadership-01/private-demo.json`. See [evidence](../../evidence/principal-lea-39-export-2026-10-16/README.md).

Full LEA-39 remains PARTIAL because Assignment completion, feedback turnaround, timetable exception and notice coverage do not yet expose equivalent owner export ports. The approved dialog and production Reports page are different compositions. Font portability, native VoiceOver/NVDA, human review, TEN-03 and production gates remain pending.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| RPT-01 | VERIFIED | PENDING | Source `370c7d703a9e4209ca5db406c22400f4eccf5519`; entitlement test follow-up `a92501b048160673a40771ee5ddd3d11305fa5cf`; live build `LCX3HkLL1u3jYJ1THM-GR` at port 3428 |
| RPT-02 | VERIFIED | PENDING | RPT-02 source `487b4050136570784bba403cf5acfdadc902a0d8`; verified demo source `d1e3bc7efbce0eb33eb95bc4b4e18a685b3c709e`; PostgreSQL, E2E and full check evidence below |
| SA-COMP-01 / SA-COMP-10 | VERIFIED | PENDING | SA-04/SA-05 projection plus current-source SA-04 display-only responsibility closure; [evidence](../../evidence/sa-comp-10/README.md) |

## SA-30 direct workflow comparison — 11 October 2026

The production report now follows the approved Report scope → Review export → Confirm composition at desktop and mobile widths. The review acknowledgement gates confirmation and CSV generation; the real Reporting owner remains responsible for scoped totals, session rows and server-authorized export. Browser evidence covers the entry, review/confirm sequence, download, invalid-range recovery, history navigation and mobile overflow. No backend contract, database row, schema, migration or seed changed. [Comparison evidence](../../evidence/admin-attendance-reporting-2026-10-11/README.md).

SA-30 remains human-review PENDING. Session completeness is the only live view. Student attendance and Class summary need new bounded owner projections, and draft persistence/resume remains unspecified. TEN-03 and native accessibility gates are unchanged.

## Administrator home visual fidelity and connected demo — 10 October 2026

The production `/admin` page uses the approved Administrator `#/home` composition with real authorized readiness, exception and attendance projections. The shared navigation presents daily work first; the header resolves the current branch and academic year; session rows include the effective teacher; and every attention action carries the exact scoped session, import or membership identifier. The `pnpm demo:seed` fixture provides current school-local submitted, attention and future-session states plus review-state import and staff-access records without rewriting historical sessions. Empty sessions and empty exceptions remain explicit states.

The reporting read joins retain organization/branch scope and use a bounded lateral teacher-assignment lookup valid on the session date, avoiding count multiplication. No schema or migration changed. Direct desktop/mobile captures, reconciliation, focused PostgreSQL/browser/build evidence and remaining typography limitation are in [admin-today-2026-10-10](../../evidence/admin-today-2026-10-10/README.md). Human visual acceptance is PENDING. TEN-03 and native accessibility evidence remain release gates.

## SA-COMP-01 administrator readiness and exceptions — 10 October 2026

Reporting now exposes a transport-neutral, browser-safe School Administrator projection that rechecks active account/token, organization, branch, membership and `school.manage`, establishes transaction-local verified context, and reads a repeatable snapshot of effective-module setup facts plus attendance/import/staff exceptions. `/admin/setup` renders derived progress and the next incomplete owner workspace; `/admin` renders current exceptions with source actions. No table or migration was added, and source owners remain unchanged.

Evidence: implementation commit `6be69d6dcb096f3a24971422d6e84050780b790e`; 115/115 unit tests, 107/107 guarded real-PostgreSQL functional tests and 84/84 Playwright journeys across desktop/mobile passed; lint, typecheck, backend compile and documentation checks passed, and Playwright's production build passed. `pnpm demo:seed` completed against the guarded development database without replacing existing data or credentials. Screenshots and exact verification notes are linked above. Next action: SA-COMP-02 Academics retirement/dependency-count LLD and implementation.

## SA-COMP-10 / SA-04 responsibility closure — 10 October 2026

SA-04 is implementation-VERIFIED with human review PENDING. The setup projection now returns an explicit role for every supported operation from a pure owner mapping, and the setup page identifies “Responsible role: School administrator.” It never names a person or supplies authorization; existing live `school.manage` and scope checks remain authoritative. An unknown future operation maps to null and an honest unavailable label. No schema, migration, seed or database write changed. Evidence and focused commands are in [SA-COMP-10](../../evidence/sa-comp-10/README.md).

## Current checkpoint

RPT-01 provides a scoped, repeatable-read attendance overview and bounded session drilldown with separate expected/submitted/pending/future/cancelled counts, P/L/A/E totals, transparent rate arithmetic and safe class labels. Every request rechecks account/token, active membership, current permission, organization/branch, release manifest, attendance entitlement and branch activation. No schema, migration, registry or write-path change was needed; application authorization remains active and RLS enforcement is deferred to TEN-03. `demo:seed` was run twice against the guarded development database and preserves the synthetic future scheduled session without replacing existing rows.

EX-12 presentation adoption is VERIFIED at source `a3664df`, with human review PENDING. The production report now separates its authorized CSV action, compact server filters, current `asOf` summary, status-aware session table, empty/failure states and pagination. Inline export denial retains filters. Reporting composition receives release configuration from the Next hosting layer. No Reporting schema, DTO, permission, transaction or persistence contract changed.

## Next action

RPT-01, RPT-02 and their EX-12 production-page adoption are implementation-VERIFIED with human review PENDING. EX-13 demo fixture and cross-page coherence is the next execution slice. TEN-03 remains an incomplete production gate under the explicit demo sequencing decision. DS-02 remains technically BLOCKED pending actual native VoiceOver and NVDA evidence; FND-02 cannot claim release readiness without this and the other documented release gates. No acceptance is inferred from any demo.

## Pending decisions / limitations

The recorded EXPLAIN plan is small-fixture evidence, not the Bible pilot benchmark or TEN-03 scale profile. Full VoiceOver/NVDA, native browser zoom, cross-browser and production accessibility checks remain release evidence; these do not imply WCAG certification. Pilot deployment/provider, backup targets and school retention requirements remain FND-02 decisions.

## RPT-01 implementation and verification — 5 October 2026

Intended outcome: an administrator can filter a branch attendance overview, explain incomplete/future/cancelled session counts separately, inspect submitted totals and rate arithmetic, and open the same scoped session records. The implementation adds portable reporting use cases/contracts/Prisma adapter, Next gateways/routes, shared-component admin screen, synthetic seed extension, unit/real PostgreSQL/Playwright coverage, and reconciled LLD/task acceptance. No reporting-owned table or migration was added.

Source commit `370c7d703a9e4209ca5db406c22400f4eccf5519`; focused real-PostgreSQL entitlement recheck test follow-up `a92501b048160673a40771ee5ddd3d11305fa5cf`. No unrelated changes were included; existing untracked `.puku-cli/` and `readiness-review.diff` were preserved. Database state: guarded development DB `vyapti_vschool`; no migration/schema change. `pnpm demo:seed` passed twice and is idempotent for existing demo records. Synthetic credentials remain in ignored `artifacts/people-02/private-demo.json`; no credential value is recorded here.

Verification evidence:

- `pnpm check` passed before the focused entitlement addition: lint, typecheck, docs (30 tasks), database design (51 table contracts), boundaries, backend compilation and 96 unit tests.
- After the added entitlement denial/restoration assertion: `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` (96/96), `pnpm check:docs`, `pnpm check:db-design` (51 contracts), `pnpm check:boundaries`, `pnpm check:backend` and focused `pnpm test:functional test/functional/attendance-sessions.test.ts` (8/8) passed. An earlier focused functional attempt had one unrelated concurrent enrollment stale-version failure; the unchanged rerun passed all 8, including report entitlement checks. Full functional suite was 101/101 before that assertion was added; it has not been rerun afterward.
- Desktop and mobile Playwright report journeys passed 1/1 each. `pnpm build` passed for source `370c7d7`; production build ID `LCX3HkLL1u3jYJ1THM-GR`. Authenticated headless Chromium smoke rendered the report and three seeded session rows. Current local server health probe returned HTTP 200/ready; the protected report path redirected unauthenticated users to sign-in (307).
- Real development PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` evidence: two-day range, year/offering filters, three sessions, 1.792ms execution, 40 shared-buffer hits; used scoped session, offering, section, subject and record indexes. Redacted plan: [query-plan.json](../../../artifacts/reporting-01-local/query-plan.json). Small dataset only; it does not satisfy either load benchmark.

Demo: `http://127.0.0.1:3428/admin/reports/attendance`; build `LCX3HkLL1u3jYJ1THM-GR`; source `370c7d7` plus test-only follow-up `a92501b`. Sign in with the existing fictional administrator credential in ignored `artifacts/people-02/private-demo.json`.

Manual review (PENDING): (1) Open the URL and sign in; expect the attendance overview. (2) Select the seeded branch/year and a two-day range; expect the future scheduled session in Future, not Pending. (3) Inspect submitted session counts and rate; expect the hand-counted P/L/A values and numerator/denominator. (4) Open a listed session and return; expect scoped class/date filters to remain. (5) Try a teacher credential or foreign filter ID; expect denial/no foreign rows. Do not mark owner acceptance until feedback arrives.

## RPT-02 implementation and verification — 6 October 2026

The existing RPT-02 vertical slice is now verified. Reporting owns a bounded CSV `ExportRun`; its forward migration is `20261005003000_reporting_exports` and was already applied in both designated databases. Export selects only submitted frozen-roster/current-record rows in the authorized branch, applies formula-safe CSV encoding, records filter/count/hash metadata, and enlists a safe Platform-owned audit event in one transaction. Attendance revision history remains served by the Attendance facade. No student payload or CSV bytes enter audit metadata. Application authorization remains active on each protected request; no RLS enforcement is claimed before TEN-03.

Verification of app source `d1e3bc7efbce0eb33eb95bc4b4e18a685b3c709e` (RPT-02 implementation commit `487b4050136570784bba403cf5acfdadc902a0d8`; focused test follow-up `e696ef1ab9aa9155f25e50b279217d7aa6abbdf0`): `pnpm check` passed (lint, TypeScript, documentation for 30 tasks, database design for 51 tables, boundaries, backend compilation, 101 unit tests). Focused `test/unit/reporting-export.test.ts` passed 5/5. Guarded real-PostgreSQL `node scripts/database.mjs functional test/functional/attendance-sessions.test.ts` passed 9/9; its RPT-02 case covered scoped roster joins, safe metadata, membership recheck, rollback and FAILED metadata, audit pagination, and the RPT-01 repeatable-read correction race. The desktop and mobile `test/e2e/attendance-sessions.spec.ts` journeys passed 1/1 per project; the related design-system and branding browser suite passed 10/10. `VSCHOOL_E2E=1 pnpm build` passed on Next 16.3.8, build `Wk4IhwKd3gwEgJmY8Xug_`. `pnpm exec prisma migrate status` confirmed all 26 migrations applied to `vyapti_vschool`; the test runner confirmed all 26 applied to `vyapti_vschool_test`. No migration was created in this checkpoint.

Real PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` from the functional export fixture recorded 7 submitted pupil-session rows, concurrency 1 and 0.204 ms execution, using the session-day, offering, section and subject indexes. This is small-fixture query evidence only, not the Bible pilot benchmark or TEN-03 scale profile. Redacted plan summary: [query-plan.json](../../../artifacts/reporting-02-local/query-plan.json).

Demo source/build: `d1e3bc7efbce0eb33eb95bc4b4e18a685b3c709e` / `Wk4IhwKd3gwEgJmY8Xug_`, live at `http://127.0.0.1:3436`. `/api/health` reports ready; `/sign-in` and `/design-system` return 200. The authenticated report route is `http://127.0.0.1:3436/admin/reports/attendance`. Use the synthetic administrator in ignored `artifacts/people-02/private-demo.json`; teacher credentials are also there for access-denial checks.

Manual review remains PENDING: (1) Sign in as the synthetic administrator and open the attendance report; expect current institution/branch context and the scoped overview. (2) Set a range with submitted attendance, download the CSV and compare session/student counts with the visible report; expect quoted, formula-safe cells and a generated filename. (3) Open a submitted or cancelled session; inspect its correction/cancellation history and verify reason, changes and actor display. (4) Try the teacher persona on report export/history; expect denial. (5) At `/design-system`, switch preview palettes and inspect the shared table, fields, navigation and auth example; preview remains local. The stored branding workflow can be reviewed at `/admin/branding`; cancel a draft preview and confirm the published palette remains, then publish through the authorized action and confirm the shell resolves it. No human review is inferred.

### Administrator completion review — 10 October 2026

SA-COMP-01 projection evidence remains valid. The authorized Phase 1 display-only responsibility amendment closes SA-04 without assignment persistence or authority side effects; SA-04 and SA-05 are implementation-VERIFIED. Human review remains PENDING.
