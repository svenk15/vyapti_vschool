# F07-B / LEA-24 exact-occurrence cover evidence

Date: 17 October 2026. Tested working tree based on `b6a0299`; the executable checkpoint is the commit containing this evidence. Human review is **PENDING**.

## Outcome

- A coordinator proposes one named substitute for one immutable published lesson occurrence.
- An independently delegated acting Principal may approve, return or reject only with exact `timetable.cover.approve` authority.
- The named substitute may accept or decline only their own request. Authority becomes ACTIVE only after both approval and acceptance.
- Activation rechecks current identity, purpose/module state, People availability, Teacher and class overlap, and Attendance state. An OPEN, SUBMITTED or CANCELLED linked register is never reassigned.
- An ACTIVE cover changes current marking authority for the source-linked occurrence. The original Teacher retains only separately authorized history.
- Immutable events and exact-input receipts retain proposal, decisions and recovery evidence. Timetable publication and historical Attendance rows remain unchanged.

## Verification

- `pnpm check`: passed; lint, TypeScript, docs, 123-table database design, extraction boundaries, portable backend compile and 200 unit tests passed.
- Focused unit: `test/unit/timetable-cover.test.ts`, 2/2 passed.
- Focused real PostgreSQL: `test/functional/timetable-cover.test.ts`, 2/2 passed. It covers separation, replay and changed-input denial, approval/acceptance, exactly one ACTIVE cover, immutable event sequence, effective Teacher, cross-branch denial, exact substitute session access, original-Teacher removal and OPEN-register cancellation denial.
- `pnpm build`: passed on Next.js 16.3.8 after the final navigation eligibility changes. Build ID: `aqh0Xa6FkbGzOwj7BQC27`.
- Development and test databases retain 81 forward migrations, including `20261017210000_timetable_occurrence_cover`; no database was reset and no applied migration was edited.
- The focused seed was run repeatedly before and after browser state changes. It reused the owned cover records without duplicates or overwriting manual records. Private IDs remain in ignored `artifacts/timetable-cover/private-demo.json`.
- `node scripts/verify-timetable-cover-local.mjs`: passed against `http://127.0.0.1:3400`. Principal and Teacher ACTIVE states persisted after reload; desktop/mobile had no horizontal overflow; mobile drawers exposed the independently guarded Cover requests destination and returned focus on Escape.

An initial focused browser run reached the Teacher acceptance but then failed because the verifier asserted focus synchronously before the shell's documented animation-frame return. The verifier was corrected to wait for the asynchronous focus contract; the unchanged product behavior then passed. The in-app browser runtime was unavailable because its installed launcher referenced a missing older plugin path, so the repository's installed Playwright Chromium was used with one browser and sequential viewports.

## Direct visual inspection

Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Principal_Leadership_Workflows/VSchool_Principal_Leadership_Workflows.html`, workflow `LEA-24 — Approve temporary cover when delegated`.

The approved source is a workflow-explorer dialog, not a complete production screen. The application therefore maps its stage order, terminology, eligibility/conflict review and final authority outcome into the established routed recipe-W/detail composition rather than reproducing the fictional catalogue dialog. Desktop 1440×1000 and mobile 390×844 captures were directly inspected for hierarchy, typography, spacing, responsive facts, action placement, selected navigation and overflow.

- [Principal ACTIVE desktop](application-active-desktop.png)
- [Principal ACTIVE mobile](application-active-mobile.png)
- [Principal mobile navigation](application-active-mobile-navigation.png)
- [Teacher ACTIVE desktop](teacher-active-desktop.png)
- [Teacher ACTIVE mobile](teacher-active-mobile.png)
- [Teacher mobile navigation](teacher-active-mobile-navigation.png)
- [Reference desktop](reference-desktop.png)
- [Reference mobile](reference-mobile.png)
- [Machine observations](comparison.json)

The documented font portability difference, native VoiceOver/NVDA checks, actual browser 200% zoom, TEN-03 restricted-role/RLS proof, production authority/configuration, load/restore/provider review and human visual acceptance remain pending.

## Manual demo

1. Sign in at `http://127.0.0.1:3400/sign-in` with the acting-Principal persona from ignored `artifacts/people-02/private-demo.json`, choose the leadership workspace, then open **Cover requests**. Expect an ACTIVE exact-occurrence cover with original/substitute facts and immutable decision state.
2. Open the cover. Expect APPROVED, ACCEPTED and ACTIVE. The only remaining Principal action is guarded cancellation; the page explains that current authority is rechecked on confirmation.
3. Sign out and use the second Teacher persona from ignored `artifacts/attendance-01/private-demo.json`. Open **Cover requests**. Expect the same ACTIVE occurrence as read-only current authority.
4. Open the linked lesson from the Teacher's day when it is current. Expect the substitute, rather than the original Teacher, to receive current register authority. Automated PostgreSQL evidence covers the time-sensitive and blocked OPEN-register cases.
