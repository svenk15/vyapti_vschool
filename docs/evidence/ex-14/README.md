# EX-14 consolidated candidate evidence

Integrated source under test: `3c3ba5de87bc24f08083714870f2701dded0ebce`. Production build ID: `dWV3Ax1JW4dqFc20_6qqb`.

- `pnpm check` passed: lint, route-type generation, TypeScript, documentation, 51-table database design, boundaries, portable-backend compilation and 113/113 unit tests.
- `pnpm test:functional` passed 106/106 tests across 16 files against real PostgreSQL `vyapti_vschool_test`; all 31 migrations were current. The suite includes authorization, revocation, scoped persistence, rollback, replay, concurrency, locking and transaction evidence.
- `pnpm test:e2e` passed 84/84 Playwright journeys with one worker across desktop and mobile. The guarded harness built the production app and used the dedicated test database. Authentication, activation/recovery, membership revocation, school context, branding, academics, staff, Students, import, Attendance and reporting journeys passed.
- An explicit `pnpm build` passed after the suites and generated the production build listed above.
- `node scripts/audit-demo-routes.mjs` passed against the guarded local development demo. [The route record](route-audit.json) contains 59 read-only render observations: 9 public, 16 administrator and 3 teacher routes at both desktop and mobile sizes, plus three administrator pages at a 720px CSS viewport as the layout equivalent of 200% zoom on a 1440px viewport. Every route returned a usable heading and no document-level overflow.
- The published [school-branded sign-in](branded-sign-in-desktop.png), [student directory desktop](student-directory-desktop.png), [student directory mobile](student-directory-mobile.png), [import desktop](import-workspace-desktop.png), [import mobile](import-workspace-mobile.png) and [teacher day mobile](teacher-day-mobile.png) captures were inspected directly. Hierarchy, spacing, action placement and containment are coherent. Wide semantic student tables intentionally use an internal horizontal scroll viewport on mobile.

Non-failing diagnostics remain visible: PostgreSQL `pg` warns that one concurrent-query test pattern is deprecated for pg 9, and one Playwright server log reported an early-closed destination stream while the associated browser test still completed successfully. Neither was hidden or converted into a passing assertion.

Native VoiceOver, NVDA and native browser 200% zoom were not executed. TEN-03 restricted-role RLS/context proof, production provider/restore review and the larger load profile remain incomplete production gates. This evidence supports a local synthetic Phase 1 demo candidate only; it does not establish production readiness or human visual acceptance.
