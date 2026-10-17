# LEA-16 Principal timetable exception evidence

Status: engineering complete for the approved synthetic-only scope; direct visual comparison complete with documented format/font deviations; human review pending.

The approved authority is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow **LEA-16 — Review timetable conflicts and uncovered classes**, together with its Timetable integration notes. The application route is `/leadership/timetable`.

The application selects the current effective immutable publication and presents two distinct owner projections. Reconciliation exceptions show exact occurrence facts and trusted manual-conflict Attendance evidence. Staffing coverage shows only current/future published occurrences with an authoritative overlapping `UNAVAILABLE` interval or a current cover workflow; it distinguishes uncovered, pending cover and active cover. Unknown availability is excluded, private source/reason data is not selected, and Cover/Attendance routes independently reauthorize every operation.

## Verification

- `pnpm check` passed lint, TypeScript, 30 documentation checks, 136 database contracts, backend boundaries/compilation and 209/209 unit tests.
- Real PostgreSQL `test/functional/timetable-cover.test.ts`: 3/3 passed against `vyapti_vschool_test`, with all 87 migrations current. It proves uncovered, pending and active composition, `UNKNOWN` exclusion, private-source exclusion, invalid cursor denial, exact replay and frozen Attendance protection.
- The unchanged reconciliation suite also passed 6/6 in the current-source accidental broad invocation. That broad invocation is not a passed batch: an unrelated institution-context expectation still expects the older branch DTO shape, and the first LEA-16 fixture attempt used a nonexistent slot key before the focused 3/3 correction.
- Focused Playwright ran sequentially with one worker: Chromium 3/3 and mobile 3/3 passed. It covers protected navigation, populated staffing and reconciliation states, exact Attendance evidence, absent mutation controls, keyboard focus, mobile drawer focus return, responsive layout and the untouched reference capture.
- Isolated production build `rllvncYayj5p8ZmrZneT4` and normal production build `_gBV-mUK4GAsJAyKisGQL` passed. No schema or migration changed.
- `node --import tsx scripts/demo-principal-timetable.ts` passed twice. It preserves the existing fictional publication/manual-conflict fixture, adds an exact staffing exception only when absent, and records its identifier only in the ignored private fixture.

## Direct visual inspection

The refreshed images were opened and compared directly at 1440×1000 and 390×844. The production route retains the approved workflow outcome in the established Principal shell: publication context, aggregate status, exact staffing evidence, cover state/next step and reconciliation evidence are clearly separated. Desktop tables align to one content grid. Mobile uses the shared labelled row composition with no viewport overflow; long class labels wrap within their cells.

- Desktop: [approved reference](reference-chromium.png), [application](application-chromium.png).
- Mobile: [approved reference](reference-mobile.png), [application](application-mobile.png).

The approved reference is a workflow-explorer dialog rather than a complete production screen. The routed recipe-L composition is therefore a documented format deviation, not a claim of pixel identity. The approved D09 facts and lifecycle are implemented; no dead proposal/approval control appears for a Principal lacking that independently delegated action. Exact font portability, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03, production controls and human acceptance remain pending.

Seed credentials remain only in ignored mode-0600 `artifacts/leadership-01/private-demo.json`; no secret is included here.

## Current-source demo

The current checkpoint builds completed with isolated ID `rllvncYayj5p8ZmrZneT4` and normal ID `_gBV-mUK4GAsJAyKisGQL`. After the focused commit, the exact source is recorded in the proportional provenance follow-up. The intended route is `http://127.0.0.1:3400/leadership/timetable` and credentials remain only in `artifacts/leadership-01/private-demo.json`.
