# Principal leadership current state

## 16 October 2026 — LDR-01 verified checkpoint

Implementation is VERIFIED; human review is PENDING.

The distinct branch-scoped `PRINCIPAL` role has only `leadership.read` and `self.read`. A verified operator can provision it through the existing versioned, replay-safe branch-membership command; ordinary staff management cannot create or alter Principal-bearing memberships. Workspace choices come from live server-returned branch/role facts, `/leadership` independently reauthorizes access, and revoked scope is denied immediately. Shared Principal home, context switch and self-account routes show an honest unavailable state until owner projections are released.

Schema: forward migration `20261016000100_principal_branch_role` changes only the existing RoleGrant CHECK to include `PRINCIPAL`; it is applied to both `vyapti_vschool` and `vyapti_vschool_test` with all 63 migrations retained and no reset. `pnpm demo:seed` invokes the guarded incremental Principal seed and writes credentials only to ignored mode-0600 `artifacts/leadership-01/private-demo.json`.

Verification: focused unit 10/10, real PostgreSQL Access 8/8, and desktop/mobile Principal Playwright 4/4 passed. `pnpm build` and the isolated E2E build passed. The repository checkpoint passed lint, type generation, docs, database design (96 contracts), boundaries, portable-backend compilation and 164 unit tests; the database registry mismatch found on the first checkpoint was corrected before the database and remaining gates were rerun. Reference and application captures were directly inspected at 1440×1000 and 390×844. The approved HTML is a workflow explorer, while the production home is the authorized application shell and deliberately contains no unreleased metrics or prototype review controls. See [evidence](../../evidence/principal-ldr-01-2026-10-16/README.md).

Remaining gates: human review, native VoiceOver/NVDA, font portability, TEN-03 and production controls remain pending. LEA-02, LEA-04 and LEA-46 are only partial; LDR-01 does not complete later owner actions or preferences/support.

Next action: LDR-02, the Attendance-owned bounded due-register projection for LEA-05/06/08, after recording its exact query/metric contract. It must preserve current Attendance authorization and may not infer missing counts.
