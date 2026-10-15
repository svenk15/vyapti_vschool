# Principal leadership current state

## 16 October 2026 — LDR-01 verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The distinct branch-scoped `PRINCIPAL` role has only `leadership.read` and `self.read`. A verified operator can provision it through the existing versioned, replay-safe branch-membership command; ordinary staff management cannot create or alter Principal-bearing memberships. Workspace choices come from live server-returned branch/role facts, `/leadership` independently reauthorizes access, and revoked scope is denied immediately. Shared Principal home, context switch and self-account routes show an honest unavailable state until owner projections are released.

Schema: forward migration `20261016000100_principal_branch_role` changes only the existing RoleGrant CHECK to include `PRINCIPAL`; it is applied to both `vyapti_vschool` and `vyapti_vschool_test` with all 63 migrations retained and no reset. `pnpm demo:seed` invokes the guarded incremental Principal seed and writes credentials only to ignored mode-0600 `artifacts/leadership-01/private-demo.json`.

Verification: focused unit 10/10, real PostgreSQL Access 8/8, and desktop/mobile Principal Playwright 4/4 passed. `pnpm build` and the isolated E2E build passed. The repository checkpoint passed lint, type generation, docs, database design (96 contracts), boundaries, portable-backend compilation and 164 unit tests; the database registry mismatch found on the first checkpoint was corrected before the database and remaining gates were rerun. Reference and application captures were directly inspected at 1440×1000 and 390×844. The approved HTML is a workflow explorer, while the production home is the authorized application shell and deliberately contains no unreleased metrics or prototype review controls. See [evidence](../../evidence/principal-ldr-01-2026-10-16/README.md).

Remaining gates: human review, native VoiceOver/NVDA, font portability, TEN-03 and production controls remain pending. LEA-02, LEA-04 and LEA-46 are only partial; LDR-01 does not complete later owner actions or preferences/support.

Next action: LDR-02, the Attendance-owned bounded due-register projection for LEA-05/06/08, after recording its exact query/metric contract. It must preserve current Attendance authorization and may not infer missing counts.

## 16 October 2026 — LDR-02 verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The Attendance-owned `register-coverage.v1` query now gives a current Principal an exact branch/date snapshot under `attendance.read_leadership`. `SESSION_END_NO_GRACE` makes a non-cancelled session due only after its scheduled end. Received plus awaiting reconciles to due; future and cancelled sessions remain separate; missing registers are never described as pupil absence. The stable bounded awaiting list contains only class, subject, schedule, due time, current dated expected Teacher and state. It excludes rosters, pupil marks, explanations, revisions and exports.

No schema or migration changed. The development and test databases retain all 63 migrations. `pnpm demo:seed` now verifies the existing connected fictional Principal fixture has received, awaiting and not-due states without changing manually created records, and writes no new credentials outside the existing ignored mode-0600 file.

Verification: focused Access unit 10/10, real PostgreSQL Attendance 12/12 and desktop/mobile Principal Playwright 4/4 passed. `pnpm check` passed lint, type generation/checking, documentation, 96 database contracts, boundaries, portable-backend compilation and 164/164 unit tests; isolated E2E and normal production builds passed. The functional suite proves metric arithmetic, early/future/cancelled handling, stable pagination, current teacher resolution, sensitive-field exclusion, cross-scope denial, revocation and module disablement. The focused browser journey proves populated and no-due states, navigation and mobile composition. Its first visual capture exposed stacked metrics and an unstyled table; the shared composition was corrected and the focused journey passed again. Final reference/application captures were directly inspected at 1440×1000 and 390×844. The approved source is a fictional workflow dialog; the application uses the production Principal shell and real seeded counts, with the same three-metric hierarchy and explanatory meaning. See [evidence](../../evidence/principal-ldr-02-2026-10-16/README.md).

Remaining gates: LDR-03 exact session evidence is still absent, so LEA-08 remains partial. LEA-06 remains partial because unavailable data is fail-closed but a retained last-known stale snapshot is not implemented. Human review, exact font portability, native VoiceOver/NVDA, TEN-03 and production controls remain pending.

Next action: LDR-03, a read-only exact-session evidence projection with independently rechecked Principal authority and no roster, marks or explanation disclosure.
