# F09 / LEA-25 / LEA-35 request-owner evidence

## Scope and authority

This checkpoint implements the approved D12/D08 synthetic-only Requests foundation. It does not enable production use, real family data, external messages, payroll/People/Timetable mutation, or general private-case visibility.

- F09: engineering complete.
- LEA-25: engineering complete for the approved operational request scope.
- LEA-35: supported partial. Protected submission, assigned or independent review, information response, public outcome and withdrawal work. Explicit acknowledgement, investigation owner/review date, and independent appeal/reopen remain.
- Human review: PENDING.

The approved explorer source is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, states LEA-25 and LEA-35. The application routes are `/admin/requests`, `/leadership/staff/requests`, `/family/concerns` and `/leadership/concerns`.

## Functional and security evidence

- `pnpm exec vitest run --config vitest.config.ts test/unit/requests.test.ts` — 3/3 passed.
- `pnpm test:functional test/functional/requests.test.ts` — 5/5 passed against real `vyapti_vschool_test` PostgreSQL.
- The functional cases cover exact no-downstream approval replay, return/response, independent routing with implicated-reviewer exclusion, replay-safe withdrawal, concurrent one-winner decisions and revoked reviewer receipt denial.
- `pnpm exec playwright test test/e2e/requests.spec.ts --project=chromium --workers=1` — 3/3 passed.
- `pnpm exec playwright test test/e2e/requests.spec.ts --project=mobile --workers=1` — 3/3 passed.
- Browser coverage follows staff submit → assigned Principal → approve → originator reload, and Family implicated concern → ordinary-reviewer omission → independent steward outcome → Family reload. Keyboard focus and horizontal overflow are checked.
- Normal and isolated E2E builds passed. The first browser attempt identified a stale `.next-e2e` build; the isolated build was regenerated before the passing current-source runs.

## Direct visual inspection

Reference and application screenshots were opened and inspected, not merely captured. The production pages preserve the approved semantic order, restrained content width, page hierarchy, action prominence, state labelling and responsive stacking. The explorer is a fictional modal over a catalogue, while the application uses the approved routed Principal/Staff/Family portal recipes; therefore dialog pixel identity is neither expected nor claimed. The established font portability exception and native accessibility gates remain.

| State | Desktop | Mobile |
|---|---|---|
| LEA-25 approved reference | `reference-lea-25-chromium.png` | `reference-lea-25-mobile.png` |
| Staff submitted receipt | `application-staff-receipt-chromium.png` | `application-staff-receipt-mobile.png` |
| Principal approved outcome | `application-principal-approved-chromium.png` | `application-principal-approved-mobile.png` |
| LEA-35 approved reference | `reference-lea-35-chromium.png` | `reference-lea-35-mobile.png` |
| Family submitted receipt | `application-family-receipt-chromium.png` | `application-family-receipt-mobile.png` |
| Independent review outcome | `application-independent-review-chromium.png` | `application-independent-review-mobile.png` |

## Persistence and demo data

Forward migration `20261018180000_requests_foundation` creates five registered `vs_requests_*` tables and is applied to development and test. No database was reset and no applied migration was edited. `scripts/demo-requests.ts` configures fictional repeat-safe staff and family cases and writes credentials only to ignored `artifacts/requests-01/private-demo.json`.
