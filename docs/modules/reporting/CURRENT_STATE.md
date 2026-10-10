# Attendance review, completeness and exports — current state

Last updated: 2026-10-10. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| RPT-01 | VERIFIED | PENDING | Source `370c7d703a9e4209ca5db406c22400f4eccf5519`; entitlement test follow-up `a92501b048160673a40771ee5ddd3d11305fa5cf`; live build `LCX3HkLL1u3jYJ1THM-GR` at port 3428 |
| RPT-02 | VERIFIED | PENDING | RPT-02 source `487b4050136570784bba403cf5acfdadc902a0d8`; verified demo source `d1e3bc7efbce0eb33eb95bc4b4e18a685b3c709e`; PostgreSQL, E2E and full check evidence below |

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
