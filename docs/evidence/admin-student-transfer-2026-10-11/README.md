# SA-21 staged Student transfer — 11 October 2026

Engineering implementation and direct reference comparison are complete. Human review remains **PENDING**.

## Authority and compared states

- Approved HTML: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html#/flow/SA-21`.
- Measured contracts: `implementation-spec/administrator/workflows/SA-21.md` and `screens/SA-21-entry.md` beneath the approved reference root.
- Application: `/admin/students/transfer`; a validated optional `studentId` opens the same workflow with the authorized Student preselected.
- Matched viewports: 1440×1000 and 390×844 at device scale 1. Reference and application captures for all three stages are in this directory. Persisted success captures come from the PostgreSQL-backed browser journey.

The inspected implementation matches the approved three-step order, headings, labels, 28 px page title, 18 px stage title, 760 px main card, 352 px supporting column, 40 px desktop controls/actions, action placement, colors and responsive stacking. Contextual entry omits the standalone search toolbar. Standalone entry uses the existing scoped name/admission search and signed-cursor pagination. Production adds authoritative current-placement facts, optional roll handling and a transactional Attendance-impact explanation; these are accepted live contracts missing from the fictional prototype rather than visual redesigns.

## Behavior and evidence

- Contextual detail/directory links and standalone entry reach one route. The standalone browser case creates more than 50 scoped Students, proves the target is absent from the first page, loads the next cursor and selects the eligible target.
- Back/Continue keeps Student, destination, date, roll and reason in memory. Changing a placement dependency clears the acknowledgement. The disabled draft action does not claim durable persistence.
- No transfer is written before `Confirm transfer`. A stale response reloads authorized current data, returns to New placement and requires renewed acknowledgement. `ROSTER_IN_USE` retains entered values and links to Attendance monitoring.
- A deliberately lost successful response retains the exact payload and idempotency key. Retry returns the original result and the database has exactly two contiguous placement rows, not a duplicate revision.
- The success receipt receives focus, preserves the confirmed result if its follow-up read fails, and offers Student record, Student list and another-transfer destinations.
- Existing Students owner tests continue to prove module/current-permission and foreign-scope denial, Attendance roster serialization, unchanged history on rejection, replay and archive safeguards.

Verification on the changed source:

- `pnpm check`: passed, including lint, generated route/type checks, documentation, DB-design, boundary/backend checks and 128/128 unit tests.
- `pnpm test:functional test/functional/students-registration.test.ts`: passed 14/14 against `vyapti_vschool_test` with 38 migrations applied and none pending.
- `pnpm test:e2e test/e2e/student-transfer.spec.ts`: passed 4/4 desktop/mobile; the harness production build passed. This covers retained values, final-only mutation, stale recovery, roster conflict presentation, exact-key lost-response replay, persistence, archive safeguards and beyond-first-page selection.
- `pnpm build`: passed on Next.js 16.3.8; the route inventory includes `/admin/students/transfer`.
- `VSCHOOL_DEMO_URL=http://127.0.0.1:3470 node scripts/verify-admin-student-transfer-local.mjs`: passed matched reference/application stage capture and document-width checks at both viewports.

`visual-verification.json` records the compared files/routes and overflow results. The final images were inspected directly for hierarchy, spacing, alignment, control proportions and mobile stacking. The shared enhanced navigation contains only implemented authorized destinations, so it intentionally differs from prototype-only modules.

The documented reference-font redistribution issue remains: the application uses the established platform fallback rather than silently bundling the reference font. Native browser zoom, VoiceOver/NVDA, TEN-03 and production-release gates were not executed here and remain outstanding. No schema, migration, backend contract or demo row changed in this slice.
