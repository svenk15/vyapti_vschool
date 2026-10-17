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

## 18 October 2026 — LEA-35 lifecycle engineering complete

Forward migration `20261018190000_requests_family_lifecycle` is applied to development and test; both now report 92 migrations. Existing categories and cases were preserved without inferred authority. Trusted synthetic configuration now explicitly supplies a third, distinct appeal reviewer.

The protected Family journey now requires assigned-reviewer acknowledgement and a branch-local review checkpoint before outcome. A first outcome opens the category's configured appeal window. One originator appeal reopens the same case for the server-configured independent appeal reviewer, retains prior decisions/public evidence, excludes the former reviewer, and requires a fresh acknowledgement before the appeal outcome. Every command keeps expected-version, actor/command/key replay, current participant/module checks, immutable event evidence and safe audit/receipt writes.

Focused current-source evidence:

- Requests unit validation: 4/4 passed.
- Requests real-PostgreSQL lifecycle/security: 7/7 passed with 92 migrations.
- Sequential one-worker Requests Playwright: 3/3 Chromium and 3/3 mobile passed, covering acknowledgement, initial outcome, appeal/reopen, independent acknowledgement/outcome, reload, reviewer omission, keyboard focus and responsive overflow.
- `pnpm lint`, `pnpm typecheck`, `pnpm check:db-design`, `pnpm check:docs`, `pnpm check:boundaries` and `pnpm check:backend` passed for the checkpoint (final architecture checks recorded with the commit evidence).
- Direct inspected comparison: `docs/evidence/principal-lea-35-lifecycle-2026-10-18/README.md`.

LEA-35 is engineering-complete for the approved synthetic-only category contract. Human review remains PENDING. Real complaint data remains blocked by school retention, disclosure, reviewer/appeal configuration, TEN-03, native accessibility and the general production gates.
