# EX-11 browser and owner evidence

Implementation source: `f218084`.

- `pnpm check` passed lint, types, documentation, 51-table database design, boundaries, portable backend compilation and 113/113 unit tests, including six Attendance roll-call domain cases.
- The final `pnpm test:e2e test/e2e/attendance-sessions.spec.ts` passed 2/2 across desktop and mobile against real `vyapti_vschool_test` PostgreSQL with all 31 migrations current. Each run completed a production build.
- The browser journey verifies the assigned Teacher Today row, another-teacher isolation, roster opening, three initially unmarked pupils, disabled review until explicit marking, keyboard marking, late minutes, review totals, lost-response recovery through the retained command key, read-only reload, administrator-only correction and canceled-session removal.
- Six desktop/mobile captures in this directory were inspected. The day view retains a compact date toolbar and single teacher destination. Focused register captures show the complete explicit-marking and submitted states without fixed-shell screenshot artifacts. Wide roster columns remain horizontally scrollable on mobile.
- The focused 9/9 Attendance PostgreSQL owner suite passed at the immediately preceding EX-10 checkpoint; EX-11 changed no portable backend, adapter, schema, transaction or authorization code, so it was not repeated. The current EX-11 browser journey exercised its real open/submit/replay persistence boundary.
- `pnpm demo:seed` was also unchanged and had passed immediately before EX-11, preserving connected teacher/student/attendance fixtures. Its current-day calendar limitation remains assigned to the final seed-coherence task.

Newly opened rosters no longer imply Present in browser state: every row begins unmarked, while the existing “Mark all present” action makes that choice explicit. Human visual review remains PENDING. Separate My classes/history, teacher correction requests, TEN-03 and native VoiceOver/NVDA/200% zoom evidence remain outside this verified slice.
