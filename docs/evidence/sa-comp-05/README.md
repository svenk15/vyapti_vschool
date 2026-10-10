# SA-COMP-05 — safe branch activity evidence

Recorded 10 October 2026. Human review is **PENDING**.

Implementation source: `2ac3f9c314674dd36819eb0ea0c8a5824dcb5120`. An exact-source `pnpm build` passed, and its loopback production server returned the expected liveness response at `http://127.0.0.1:3400`.

## Outcome

The School administrator can open `/admin/activity`, filter an inclusive range of at most 93 days by one allowlisted category, review a branch-scoped keyset page, open a privacy-minimized detail and copy the request ID as a support reference. The server rechecks the current account, token version, active institution, active branch, current membership and `school.manage` on every list/detail read. Fixed command descriptors suppress unknown commands and prevent stored resource labels, actor identity, reasons or arbitrary audit JSON from entering browser DTOs.

Privacy requests, support impersonation, unrestricted export and deletion remain unavailable because this task does not own their authority contracts. TEN-03 RLS/restricted-role enforcement remains incomplete and blocks real-client/production use.

## Database

Forward migration `20261010010000_platform_activity_index` adds `vs_platform_audit_entry_activity_idx` on `(organization_id, school_id, occurred_at DESC, id DESC)`. It was applied without resetting data to both `vyapti_vschool` and `vyapti_vschool_test`; both now have 33 migrations. No table or row contract changed. PostgreSQL verification ran `EXPLAIN (ANALYZE, FORMAT JSON)` with sequential scan and explicit sort disabled transaction-locally to prove this index is executable for the exact branch-time predicate. The planner may prefer the older scope index for tiny datasets.

## Executed verification

- `pnpm check`: passed; lint, generated route types, TypeScript, docs, database design, extraction boundaries, portable backend and 120 unit tests.
- `pnpm test:functional -- test/functional/platform-activity.test.ts`: the command syntax unintentionally ran the complete suite; 114 existing tests plus 3 of 4 new tests passed. The only failure was the overly strict tiny-dataset index-choice assertion; authorization, branch isolation, safe projection, suppression and pagination all passed.
- `pnpm test:functional test/functional/platform-activity.test.ts`: passed 4/4 after making the plan proof transaction-local and deterministic.
- A later chained type/backend/functional verification reached a transient Prisma schema-engine error before tests started; the immediate standalone guarded functional command applied no migrations and passed 4/4, including the added Asia/Kolkata local-midnight boundary case.
- `pnpm test:e2e test/e2e/platform-activity.spec.ts`: final run passed 4/4 across desktop and 390px mobile production builds. Earlier runs exposed and corrected async sign-in waiting, mobile drawer navigation, duplicate accessible heading text and an ambiguous Next route-announcer locator.
- `pnpm demo:seed`: the first default-sandbox run stopped at TEN-02 because local PostgreSQL sockets were denied (`EPERM`) after preserving earlier fixtures. The authorized socket-capable run then passed all feature-owned seed steps, preserved existing credentials/records, and confirmed the connected 6 October 2026 attendance scenario with three assigned sessions.
- Screenshots visually inspected: [desktop](activity-chromium.png) and [mobile](activity-mobile.png). The desktop hierarchy, filters, table, safe detail and focus state are aligned. Mobile uses the existing compact header and responsive table; long UUID references wrap. Native browser 200% zoom, VoiceOver and NVDA were not run and remain separate gates.

No secrets, credentials, raw student facts or arbitrary audit JSON are included in this evidence.
