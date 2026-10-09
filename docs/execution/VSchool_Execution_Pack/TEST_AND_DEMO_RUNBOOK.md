# Verification and demo runbook

## Fast loop with meaningful evidence
- Pure visual slice: affected TypeScript/lint/boundary checks and targeted keyboard/route/browser checks. No new database tests just to assert CSS.
- Domain/use-case change: Vitest unit tests for actual invariants, plus real PostgreSQL functional checks for persistence/authorization affected. Existing Vitest JUnit XML configuration is the JUnit strategy; do not introduce Java/JUnit into this TypeScript project.
- Persistence/security change: real PostgreSQL is mandatory for uniqueness, composite FKs, rollback, scope denial, version conflict and same-key replay. Mocks and SQLite cannot prove these. Earlier HBase discussion does not match the implemented stack; do not add HBase.
- Integration checkpoint: full pnpm check, pnpm test:functional, pnpm test:e2e and pnpm build on the existing guarded test harness. Full suite once per batch, plus reruns needed for actual failures/security changes; never skip a mandatory repository gate.
- Manual/native review: record separately. Automated screenshot, accessibility tree or zoom emulation is not VoiceOver/NVDA conformance.

Read each existing command's supported filtering mechanism before attempting a narrowed invocation. Do not invent command flags or bypass scripts/database.mjs database safety. Tests use the dedicated vyapti_vschool_test database; demos use guarded local development vyapti_vschool. Check DATABASE_URL target before mutation without printing credentials.

## Core evidence matrix
| Risk | Required example |
|---|---|
| Tenant leakage | Same resource UUID requested from another institution/branch denied; no data in error. |
| Permission revocation | Open screen, revoke membership/assignment, next protected action denied. |
| Plugin enablement | License/branch activation/release/capability denial; hidden nav and protected endpoint agree. |
| Concurrency | Two stale edits conflict; same-key retry does not duplicate committed command. |
| Network ambiguity | Lose submit response; recover original receipt before new intent. |
| Data integrity | Transfer dates preserve history; submitted attendance roster remains pinned. |
| UI | Real screens at 1440 and 390; input labels, drawer focus and action alignment; outside-sidebar geometry preserved on nav-only ticket. |
| Demo consistency | Teacher submission appears in the admin report for the same seeded branch/session. |

## Local demo
Prefer already configured local setup. Do not rerun provisioning merely because a new UI ticket starts. If installation is needed, follow live START_ON_MAC.md and the checked-in lockfile. Known snapshot commands are pnpm install --frozen-lockfile, pnpm setup:local, pnpm db:setup, pnpm setup:auth, pnpm demo:seed and pnpm dev. Database/auth setup is for a missing setup, not a reset instruction.

Use pnpm demo:seed after a slice adds fixture needs. Preserve fictional credentials and manually created testing data; no teardown in this scope. Never include credentials in tracked docs or this pack; point to generated private-demo artifacts. Keep dev mail sink, no real sends.

After each slice ensure a server for its current tested source is reachable, or report why unavailable. Keep the configured port (snapshot default 3400) unless occupied; report actual URL and process/build identity. Prefer existing demo:task harness after reading its options. Do not start a server per browser test or terminate unrelated servers. A request to keep working does not guarantee the agent/runtime stays alive all night.

## Final manual walkthrough
1. School-branded sign-in → correct admin branch and navigation.
2. School settings and published branding → safe preview.
3. Staff profile → verified teacher readiness and actual scoped access.
4. Academic year/section/offering → eligible assignment.
5. Student registration → enrollment and dated placement history.
6. Mixed-validity CSV → preview, confirm, partial outcome and recovery.
7. Admin schedules session → teacher marks/submits → receipt survives reload.
8. Admin report → same submitted session → authorized correction/history/export.
9. Disabled module, wrong branch and revoked permission → safe denial.

Keep TEN-03 and production/provider/restore/load gates explicit. Real client data must not be used for a synthetic demo checkpoint.
