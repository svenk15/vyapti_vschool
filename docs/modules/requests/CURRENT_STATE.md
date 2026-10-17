# Requests current state

## 18 October 2026 — F09 and LEA-25 engineering complete; LEA-35 supported partial

D12/D08 synthetic-only approval resolves the initial category and restricted-participant rules. Forward migration `20261018180000_requests_foundation` is applied to development and test databases; both report 91 migrations. The five Path-A Requests tables are registered in the database dictionary. No applied migration was edited and no database was reset.

Implemented owner behavior includes current account/school/module checks, exact staff membership or accepted Guardian/Student relationship, trusted server-resolved ordinary/independent reviewer routing, originator/reviewer separation, expected versions, immutable decision/response evidence, replay-safe submission/decision/response/withdrawal, safe audit envelopes and no downstream People/Timetable/payroll mutation. Unchanged trusted category setup is repeat-safe. Staff, Family and separated Principal production routes use the shared shell and page recipes.

Verification on the exact checkpoint worktree:

- `pnpm exec vitest run --config vitest.config.ts test/unit/requests.test.ts` — 3/3 passed.
- `pnpm test:functional test/functional/requests.test.ts` — 5/5 passed against real `vyapti_vschool_test` PostgreSQL with 91 migrations.
- `pnpm check:backend`, `pnpm check:boundaries`, `pnpm typecheck` and both normal/E2E `pnpm build` variants passed.
- One-worker Playwright, run sequentially, passed 3/3 Chromium and 3/3 mobile. It covered staff submit/approve/reload, family independent routing and implicated-reviewer omission, exact reference-dialog capture, keyboard focus on the final staff decision and horizontal-overflow checks.
- Direct screenshot inspection is recorded in `docs/evidence/principal-f09-requests-2026-10-18/README.md`. The approved reference is a workflow explorer, so the routed production composition is compared for hierarchy, semantic stages, actions, spacing and responsive behavior rather than claimed as dialog pixel identity. The established font-portability exception remains.

F09 and LEA-25 are engineering-complete for the approved synthetic-only scope. LEA-35 is a supported partial: protected family submission, independent routing, assigned review, public outcome, information response and withdrawal work; explicit acknowledgement, investigation-owner/review-date lifecycle and independent appeal/reopen remain. Human review is PENDING. Production remains blocked by school category/appeal/retention configuration, TEN-03, native accessibility and the general release gates.
