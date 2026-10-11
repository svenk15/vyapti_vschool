# Administrator overnight queue handover

Final queue checkpoint: 11 October 2026. Canonical workflow statuses remain in `docs/execution/SCHOOL_ADMIN_WORKFLOW_MATRIX.md`. Human acceptance is **PENDING** throughout.

| Priority | Journey and workflow coverage | Functional/security verification | Reference-based visual comparison | Known deviations | Checkpoint/evidence |
|---|---|---|---|---|---|
| 1 | Attendance correction: Today → submitted register → correction/retry/stale recovery → history/reload → Today (SA-26/SA-27) | VERIFIED; focused real PostgreSQL, command replay, stale-state and local browser evidence | DIRECT comparison at desktop/mobile; enhanced register and compact selector inspected | Real register/history remain richer than the prototype; Nimbus Sans redistribution is unresolved | `ce47b79` through `d262a93`; [evidence](../admin-attendance-journey-2026-10-11/README.md) |
| 2 | Attendance lifecycle: schedule → monitor/detail → reasoned cancel → retained history (SA-25/SA-26/SA-28) | VERIFIED; persisted development journey plus retained owner authorization/concurrency evidence | DIRECT desktop/mobile comparison | Draft persistence is unavailable; scheduling uses the offering's real dated primary teacher | `6ef274f`; [evidence](../admin-attendance-lifecycle-2026-10-11/README.md) |
| 3 | Attendance reporting: scope → results → reviewed CSV export → URL-state return/error recovery (SA-30) | VERIFIED; real scoped projection/export authorization retained and focused browser passed | DIRECT desktop/mobile comparison | Student attendance and Class summary projections lack owner query contracts; drafts unavailable | `7bc8b22`; [evidence](../admin-attendance-reporting-2026-10-11/README.md) |
| 4 | Student management: directory state → Student record → permitted name correction → enrollment/history → return (SA-20 plus directory) | VERIFIED; owner PostgreSQL/replay/locking evidence retained and focused persisted browser passed | DIRECT desktop/mobile comparison | Separate first/last fields follow the accepted People contract; draft lifecycle and font portability remain open | `16988c4`; [evidence](../admin-student-management-2026-10-11/README.md) |
| 5 | Student registration and placement: dedicated registration → enrollment/section placement → receipts/history (SA-18/SA-19) | VERIFIED; scoped identity/admission rules, atomic persistence, exact selection, duplicate/year failures and safe replay passed against real PostgreSQL | DIRECT desktop/mobile comparisons and receipts inspected | Draft lifecycle remains open; standalone enrollment selection is capped at the supported 100-record projection, with the paginated directory used beyond it | `b39cc86`, `697c711`; [registration](../admin-student-registration-2026-10-11/README.md), [placement](../admin-student-placement-2026-10-11/README.md) |
| 6 | Staff/access: Employee creation → verified grant → local invitation activation → suspend/reinstate (SA-13–SA-17) | SA-13/14/17 VERIFIED end to end. SA-15 safe resend and SA-16 current binding/enablement are VERIFIED_SUPPORTED_SLICE | DIRECT for SA-13/14/17; PARTIAL with exact captured references for SA-15/16 | SA-15 lacks accepted reason/audit-reason input; SA-16 lacks dated eligibility/assignment-impact owner contract; drafts unavailable | `02ba4ce`; [evidence](../admin-staff-access-2026-10-11/README.md) |

## Current executable demo

- Source: `02ba4cee2014a3a495e3e9f2fc3759cd5dec38ba`
- Production build: `TEPKFVik4z6UA_YZ4PO9l`
- URL: `http://127.0.0.1:3400/sign-in`
- Start: `pnpm demo:start` (after `pnpm build` when source changed)
- Seed: `pnpm demo:seed`
- Administrator and teacher credentials: ignored private file `artifacts/people-02/private-demo.json`
- Attendance scenario: ignored private file `artifacts/attendance-01/private-demo.json`, school-local date `2026-10-11`

`pnpm demo:seed` completed without replacing existing records and reported three assigned sessions plus preserved submitted/scheduled/report fixtures. The final production build passed. Use `pnpm demo:start` so the local server receives the explicit Phase 1 release manifest; plain `pnpm start` intentionally does not infer released modules. A read-only authenticated browser smoke verifies that Attendance is both present in the server-filtered navigation and renders its usable Session step, in addition to the connected Administrator and teacher routes. The focused Staff/access test passed 1/1 desktop and 1/1 mobile against `vyapti_vschool_test`; the remaining journey-specific verification is linked above and was not rerun unchanged.

## Consolidated walkthrough

1. Sign in as the synthetic administrator. On **Today**, confirm the connected attendance and attention data for 11 October 2026.
2. Open **Attendance**. Schedule an eligible session, inspect the monitor, open a submitted register, make a reasoned correction, review history, and reload. Use a separate eligible scheduled occurrence for cancellation and confirm its retained history.
3. Open **Reports → Attendance**. Apply the seeded date scope, acknowledge the export review, inspect totals/session rows, download CSV, and use browser Back/Forward to confirm URL state.
4. Open **Students**. Exercise attribute search, filters and Sort; open a Student, perform the permitted reasoned name correction, inspect enrollment/history, and return to the same directory state.
5. Use **Register student** for the dedicated SA-18 composition. Then use **Enroll a student** or the Student-specific enrollment link to place the Student into a real open year/section and inspect the receipt/history.
6. Open **Staff & access → Staff profiles**. Use **Create staff profile**, then **Grant sign-in access** for an exact active Employee. Review the receipt. Use **Change access** to suspend or restore an eligible membership. Invitation delivery remains in the local development sink only.
7. Sign out and sign in as the synthetic teacher. Open **My teaching day** for 11 October 2026 and verify the three assigned sessions and supported session actions.

## Outstanding gates

Human visual acceptance is pending. TEN-03 restricted-role/RLS context proof, native VoiceOver/NVDA evidence, production provider review, restore/load evidence and the documented body/navigation font portability issue remain release gates. SA-15's reasoned recovery composition and SA-16's dated eligibility workflow require the precise owner contracts recorded above. This checkpoint is a local synthetic demo, not production readiness.
