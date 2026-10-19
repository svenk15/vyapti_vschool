# UX-14 specialized workflow evidence

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Parent source: `2a8bc79` plus the focused UX-14 diff committed with this record.
- Standard production build: `PeGqBjWCEJo4UkqEYdYWG` with the repository's established 4 GiB Node heap.
- Isolated browser build: `Mczgy3p0gxdkhTAsOrKc_`.
- Database state: development and test retain 118 forward migrations. UX-14 changes no schema or migration.
- Browser evidence used Playwright because the installed in-app browser client referenced a missing local service script. Desktop and mobile projects ran sequentially with one worker.

## Implemented correction

- Teacher Attendance keeps the specialized submitted-register composition. Read-only rows now align admission number, pupil, status and `Flag error` action without the previous wrapped desktop action; mobile rows preserve a full-width action. Immutable receipt/revision history now uses the shared padded-card geometry.
- Teacher assessment entry retains the existing one-pupil owner command, pinned scale, exact version and protected exact-key recovery. A shared three-stage indicator now exposes Outcome, Review and Receipt without moving persistence before final confirmation.
- Teacher timetable was inspected as the established specialized grid/list recipe. No presentation or owner change was required.
- The attendance-history browser selector now targets the exact fixture session identifier. This avoids choosing an older same-label immutable fixture while preserving the test's authorization and history assertions.

## Reference classification and direct inspection

- Attendance: the approved TEA-12/TEA-13 workflow states are pattern references. The application unknown, recovered and immutable-history states were compared with their alert, action and receipt patterns at desktop and mobile sizes. They are design extensions, not claimed pixel-identical reference pages.
- Assessment entry: the approved Teacher gradebook is an exact visual reference for the section hierarchy, controls and review emphasis. The current approved owner contract saves one reviewed pupil outcome per command rather than a bulk loaded-page gradebook. The application keeps that supported-scope deviation explicit and does not fake bulk persistence.
- Timetable: the implemented desktop schedule grid and mobile day list conform to the approved specialized timetable recipe, including break and unassigned periods. Room data remains unavailable in the owner projection and was not invented.
- Final captures were directly inspected for typography, spacing, action placement, responsive containment and immutable-history readability. Inter remained the computed application font in the focused browser runs.

## Focused verification

- `pnpm exec eslint components/assessment-mark-entry.tsx` — passed.
- `pnpm exec tsc --noEmit` — passed.
- Teacher Attendance plus timetable, Chromium — 2/2 passed.
- Teacher Attendance plus timetable, Mobile Chromium — 2/2 passed.
- Assessment planning prerequisite, mark entry and exact reference capture, Chromium — 3/3 passed.
- The same assessment sequence, Mobile Chromium — 3/3 passed.
- Final submitted-register journey after row geometry change, Chromium — 1/1 passed.
- Final submitted-register journey after row geometry change, Mobile Chromium — 1/1 passed.
- Immutable-history journey after exact-session selector repair, Chromium — 1/1 passed.
- Immutable-history journey after exact-session selector repair, Mobile Chromium — 1/1 passed; its final screenshot is present in this directory.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, build `PeGqBjWCEJo4UkqEYdYWG`.

An earlier full Attendance milestone invocation finished 7/9. One failure was the ambiguous history selector repaired in this slice; the other was an unrelated account-context assertion that expected exactly one branch after repeat-safe fixtures had created additional authorized branches. This focused checkpoint does not relabel that full invocation as passed.

## Captures

- `attendance-unknown-{desktop,mobile}.png`
- `attendance-recovered-{desktop,mobile}.png`
- `attendance-history-{chromium,mobile}.png`
- `reference-attendance-{desktop,mobile}.png`
- `assessment-entry-{desktop,mobile}.png`
- `assessment-receipt-{desktop,mobile}.png`
- `reference-assessment-{desktop,mobile}.png`
- `timetable-{desktop,mobile}.png`

## Remaining gates

Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, font portability, TEN-03 and production release remain pending. No owner business behavior, authorization, persistence or module availability changed in UX-14.
