# TT-06 Teacher published timetable — 13 October 2026

## Outcome and authority

This checkpoint verifies the Teacher/TEA-22 slice of TT-06. It does not complete the Student or Parent projections and does not implement TEA-23 cover acceptance or TEA-24 schedule-change requests.

The approved reference is `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/planning`, weekly timetable state. The production route is `/teacher/timetable`.

The portable Academics query resolves the authenticated account through its active Person, Employee and Teacher records, then projects effective immutable published slots through dated Teacher assignments. It joins Attendance only through trusted timetable occurrence linkage. The browser supplies only a candidate week; it cannot assert identity, assignment or source linkage. The query rechecks live token, scope, membership, capability and module availability in a repeatable-read transaction. No table, migration or write path changed.

## Visual comparison

- [Approved desktop reference](reference-chromium.png)
- [Application desktop](application-chromium.png)
- [Approved mobile reference](reference-mobile.png)
- [Application mobile](application-mobile.png)

The images were inspected directly, rather than only checked for overflow. The application matches the reference's page hierarchy, week control, weekday grid, published lesson treatment, compact mobile day selection and register action placement using real owner data.

Remaining differences are explicit and unaccepted: the current owner schema has no room source; the projection contains assigned lesson periods rather than a full school-day template with empty periods and breaks; cover and change-request controls require later TEA-23/TEA-24 contracts; the prototype review bar is not production shell content; and the established body-font portability deviation remains. Native VoiceOver/NVDA, actual browser 200% zoom and human visual acceptance were not performed.

## Verification

- Focused unit: `pnpm exec vitest run --config vitest.config.ts test/unit/teacher-timetable.test.ts` — passed 1/1.
- Real PostgreSQL: `pnpm test:functional test/functional/timetable-reconciliation.test.ts` — passed 5/5 against the guarded test database, including scoped projection, trusted session linkage, foreign-branch denial and revoked-membership denial.
- Focused Chromium and mobile Playwright timetable journeys — passed 1/1 per project with one worker after the final weekly composition.
- `pnpm check` — passed: lint, generated route types, TypeScript, documentation, 63-table database design, architecture boundaries, portable backend compile and 143/143 unit tests.
- Final current-source Chromium, one worker — passed 2/2: the Teacher attendance milestone and published-timetable journey.
- Final current-source mobile, one worker — passed 2/2: the same two journeys at 390 × 844.
- Production build `WS5MrJzWbCYSuEveDOU3x` passed after the final application rewrite. Later changes before checkpointing were limited to tests and evidence.

Development and test databases remain on the existing 46-migration history. No migration was added or rewritten.

## Manual walkthrough

1. Sign in with the Teacher persona from the ignored private credential file and open `/teacher/timetable`.
2. Confirm only assigned published lessons appear in the weekly grid and the school-local timezone is shown.
3. Use **Previous week**, **Next week**, and the week field. Expect the URL and projection to change together, with no draft timetable exposed.
4. On mobile, select weekday tabs. Expect the selected day's lessons and empty periods to remain keyboard reachable.
5. Choose **Open register**, **Continue register**, or **View register** where present. Expect the linked authorized Attendance session; a published lesson without a trusted session has no fabricated action.

Human acceptance: **PENDING**.
