# Attendance review, completeness and exports — current state

Last updated: 2026-10-05. No active execution timer.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| RPT-01 | VERIFIED | PENDING | Source `370c7d703a9e4209ca5db406c22400f4eccf5519`; entitlement test follow-up `a92501b048160673a40771ee5ddd3d11305fa5cf`; live build `LCX3HkLL1u3jYJ1THM-GR` at port 3428 |
| RPT-02 | BLOCKED | NOT_REQUESTED | Requires explicit ATT-04 human acceptance before export/audit implementation |

## Current checkpoint

RPT-01 provides a scoped, repeatable-read attendance overview and bounded session drilldown with separate expected/submitted/pending/future/cancelled counts, P/L/A/E totals, transparent rate arithmetic and safe class labels. Every request rechecks account/token, active membership, current permission, organization/branch, release manifest, attendance entitlement and branch activation. No schema, migration, registry or write-path change was needed; application authorization remains active and RLS enforcement is deferred to TEN-03. `demo:seed` was run twice against the guarded development database and preserves the synthetic future scheduled session without replacing existing rows.

## Next action

Continue with DS-02: validate real protected screen recipes and accessibility. ATT-02 and BRD-02 are VERIFIED/PENDING and are implementation dependencies only; neither task defines a human-PASSED gate. RPT-02 remains blocked on explicit ATT-04 human acceptance. TEN-03 is likewise blocked on ATT-04 acceptance. No acceptance is inferred from the RPT-01 demo.

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
