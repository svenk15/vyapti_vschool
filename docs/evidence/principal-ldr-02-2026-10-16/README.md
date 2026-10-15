# LDR-02 Principal register coverage evidence

Date: 16 October 2026. Human review: **PENDING**.

## Outcome and contract

The production Principal workspace now shows exact Attendance register coverage for one authorized branch and school-local date. `register-coverage.v1` uses `SESSION_END_NO_GRACE`: a non-cancelled session is due when `ends_at <= server asOf`. Received plus awaiting reconciles to due. Future and cancelled sessions remain separate, and an awaiting register is never described as pupil absence.

The exact capability is `attendance.read_leadership`. The server rechecks the live account, organization, branch, explicit Principal role, release, entitlement and activation before retrieval. Results exclude rosters, pupil marks, explanations, revision history, exports and mutations. No schema or migration changed; development and test retain all 63 migrations.

## Verification

- Focused Access unit: 10/10 passed.
- Real PostgreSQL `test/functional/attendance-sessions.test.ts`: 12/12 passed. Coverage includes denominator arithmetic, early/future/cancelled states, stable keyset pagination, dated Teacher resolution, sensitive-field exclusion, other-role/cross-scope denial, revocation and disabled-module denial.
- Desktop/mobile `test/e2e/principal-attendance.spec.ts`: 4/4 passed with one worker after the final presentation correction. It covers populated and no-due states, Principal navigation, keyboard-reachable mobile navigation and horizontal containment.
- Isolated E2E production build passed and included `/leadership/attendance`.
- `pnpm check` passed lint, type generation/checking, documentation, 96 database contracts, backend boundaries/portable compilation and 164/164 unit tests.
- The final normal production build passed and included the Principal home and Attendance oversight routes.
- The first focused rerun was blocked before tests because the local PostgreSQL service stopped accepting connections. A normal fast service restart preserved both databases; the same focused browser command then passed 4/4. No database reset or migration reversal occurred.
- The small synthetic scoped query plan is recorded in [query-plan.json](query-plan.json). It is query-shape evidence, not the TEN-03 scale profile or a performance claim.

JUnit evidence: [unit](unit.junit.xml), [functional](functional.junit.xml), [browser](e2e.junit.xml).

## Direct visual comparison

Approved authority: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, scenario **First release · Attendance oversight**.

The first application capture was inspected and rejected as evidence because five stacked cards and a table without the shared table class produced poor desktop density and unreadable mobile columns. The corrected application uses the approved Received / Due / Awaiting three-metric hierarchy, explanatory absence boundary, compact desktop table and labelled mobile register cards.

- Desktop: [approved reference](reference-coverage-chromium.png), [corrected populated application](application-populated-chromium.png), [corrected no-due application](application-no-due-chromium.png).
- Mobile: [approved reference](reference-coverage-mobile.png), [corrected populated application](application-populated-mobile.png), [corrected no-due application](application-no-due-mobile.png).

The approved HTML is a fictional workflow-review dialog with sample totals; the application is the production Principal shell with real authorized fixture totals and a date toolbar. Prototype review controls, fictional names and sample totals are intentionally absent. The three-metric hierarchy, terminology, information boundary, spacing and responsive composition were directly compared. Exact font portability remains a documented deviation; native VoiceOver/NVDA was not performed.

## Demo fixture and limits

`pnpm demo:seed` invokes the guarded incremental verifier in `scripts/demo-principal-attendance.ts`. It reuses the existing fictional branch data and requires at least one received, awaiting and not-due state without overwriting manual data. Private credentials remain only in ignored mode-0600 `artifacts/leadership-01/private-demo.json` and are never printed.

LDR-03 exact-session evidence is not implemented, so the awaiting list has no dead View action. LEA-08 remains partial. LEA-06 is partial because current-source time and fail-closed unavailable behavior are implemented, while retained last-known stale data is not.
