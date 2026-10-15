# PAR-18 combined Parent calendar evidence

Status: ENGINEERING_VERIFIED_SUPPORTED_SLICE / DIRECT_COMPARISON_PARTIAL / HUMAN_REVIEW_PENDING

## Outcome

The Parent **School calendar** now places the effective published teaching week for the selected From date beside the already-verified permitted Events agenda. Timetable and Events keep independent live authorization: the teaching section appears only when the exact selected child has `timetable.read_child`, while every event still requires `calendar.event.read_child` and its frozen publication binding. Changing child or date resolves both projections again on the server.

This is read-only page composition. It adds no table, migration, transaction, receipt, purpose or authority. A `HOLIDAY` event does not change or prove the academic calendar; only the effective published Timetable projection determines teaching days.

## Reference and visual inspection

- Approved unchanged reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-18`
- Reused unchanged reference captures: `reference-desktop.png`, `reference-mobile.png`
- Current application captures: `application-chromium.png`, `application-mobile.png`
- Application route: `/family/calendar?child=<authorized-student-id>`

The reference and application were directly inspected at 1440×1000 and 390×844. The application uses the approved Parent shell, child context, content width, typography scale, form controls, cards, action treatment and mobile stacking. The new day summary remains compact at desktop and forms two columns on mobile. A six-day pattern appears in both the browser assertion and capture, so the UI does not assume a five-day week.

The reference is a generic three-stage review prototype rather than an operational mixed-calendar screen. The production page is therefore a labelled supported composition extension, not an exact screen match. Font portability, native accessibility and human visual acceptance remain pending.

## Verification

- `pnpm typecheck` — PASS.
- Focused ESLint for the page and browser test — PASS.
- Normal production build — PASS.
- Isolated `VSCHOOL_E2E=1` production build — PASS.
- Focused Chromium Playwright, one worker — PASS, 1/1.
- Focused mobile Playwright, one worker — PASS, 1/1.
- The browser fixture uses current accepted Parent access, independent Events/Timetable purposes, all required module entitlements/activations, a six-day published pattern and a class-scoped immutable event.
- Existing current PostgreSQL owner evidence remains applicable because no backend code or schema changed: EV-02 Events 3/3 and the Guardian Timetable effective-day test both passed on the unchanged owners.

The first browser attempt served the prior `.next-e2e` artifact because only the normal `.next` build had been refreshed. The trace showed the old filter labels and absent teaching section. The isolated E2E artifact was rebuilt; the next run exposed the fixture's omitted documented `staff_core` Timetable dependency. The fixture was corrected, and unchanged product assertions then passed in both projects. No timeout or authorization rule was weakened.

## Remaining PAR-18 gaps

- Academic-closure semantics beyond the existing effective published Timetable owner projection.
- Recurrence and advanced event interactions, including response/withdrawal, capacity and consent boundaries.
- Exact visual acceptance of the operational extension by the user.
- Font portability, VoiceOver/NVDA and TEN-03 production gates.
