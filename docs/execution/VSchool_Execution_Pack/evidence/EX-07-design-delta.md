# EX-07 design delta

Date: 2026-10-10

- `/admin/academics` consumes existing ACA-01/ACA-02 year, term, catalog and immutable-calendar operations; `/admin/classes` consumes existing ACA-03 offering and dated-assignment operations. No recurring timetable or retirement operation is introduced.
- Academics retains all owned tables and scoped joins documented in its LLD. No schema or migration changes are required. Existing branch scope, `school.manage`/`class.manage`, release, entitlement and activation checks remain in owner reads and guarded mutations.
- Mutations retain account → Organization → School locking, versions, exact idempotency receipts and Attendance impact checks. Reads remain unlocked and reauthorize current scope. Inclusive screen dates convert once to exclusive API dates.
- The portable Academics factory now requires its database URL, release manifest and clock from the hosting layer. It no longer reads environment configuration or supplies release fallbacks.
- Presentation separates year/calendar, catalog and offering/assignment work. Validation, conflict, stale, denied, empty and success outcomes continue through current typed owner responses. Focused verification covers date rules, PostgreSQL transactions/authorization and desktop/mobile workflows.
- Remaining owner gaps are unchanged: catalog retirement/dependency counts and recurring timetable/substitution are outside this slice. TEN-03, production provider and native accessibility gates remain open.
