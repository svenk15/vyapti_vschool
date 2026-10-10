# EX-10 browser and owner evidence

Implementation source: `91fcb6ce4b7eb3506016a1f6e80ec741c3801444`.

- `pnpm check` passed lint, types, documentation, 51-table database design, boundaries, portable backend compilation and 113/113 unit tests.
- The final isolated `pnpm test:functional test/functional/attendance-sessions.test.ts` passed 9/9 against real `vyapti_vschool_test` PostgreSQL with all 31 migrations current. It covers scheduling, scope and permission checks, frozen roster, submission, recovery, correction, cancellation, rollback, replay, concurrency and reporting reads. An earlier run saw the existing concurrent enrollment case lose PostgreSQL serialization with `STALE_VERSION`; inspection confirmed no backend file changed, and the final isolated run exercised the intended first-committer path successfully.
- The final `pnpm test:e2e test/e2e/attendance-sessions.spec.ts` passed 2/2 across desktop and mobile after correcting ambiguous test locators. The journey schedules, opens and submits a register, recovers a lost submit response, denies another teacher, corrects as administrator, audits authorization, cancels while retaining records, and verifies the assigned teacher no longer sees the canceled occurrence.
- Each Playwright run completed a production build. `pnpm demo:seed` passed against guarded `vyapti_vschool`, preserving existing connected administrator/teacher/student/attendance fixtures and private credentials.
- Six desktop/mobile captures in this directory were inspected for page hierarchy, constrained forms, session-row density, record-table containment, revision history, destructive-action separation and narrow-screen overflow. Wide correction data remains horizontally scrollable at mobile width.

No schema, migration, lock, version, receipt or owner API changed. Human visual review remains PENDING. The current demo seed reports that 10 October is not a teaching day in the existing calendar and preserves that truth; its prepared reporting occurrence is 12 October. EX-14 owns final cross-role seed/date coherence. TEN-03 and native VoiceOver/NVDA/200% zoom evidence remain release gates.
