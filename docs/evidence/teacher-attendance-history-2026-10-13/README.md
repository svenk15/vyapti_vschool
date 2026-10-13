# TEA-14 Teacher attendance history — 13 October 2026

## Authority and outcome

- Approved reference: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Teacher_Design/VSchool_Teacher_Review.html#/history` and its attendance TEA-14 LLD.
- Application: `/teacher/history` → `/teacher/sessions/[id]`; `/teacher/classes/[id]` consumes the same Attendance-owned assigned-session projection.
- Outcome: an authorized Teacher locates sessions by subject/class/date within current assignments, opens the exact submitted register, reads its immutable receipt/revisions and sees the administrator correction handoff. No Teacher correction, export or support-request mutation was added.
- Source baseline: `1a1168e`; this directory records the immediately following focused checkpoint. Human acceptance is **PENDING**.

## Security and persistence

Each list/detail/history read rechecks account token, active Institution/Branch membership, module release/entitlement/activation, `attendance.read_class`, current bound Employee/Teacher identity, and assignment coverage both now and on the session date. Filters and deterministic sort/pagination execute in the Attendance repository under repeatable-read transaction-local scope. Sessions later than school-local today and cancelled sessions are excluded. A revoked membership or foreign Branch is denied; an unassigned Teacher receives no rows. Existing `attendance.correct` denial remains intact. There is no write, schema change or migration; both databases remained at all 46 migrations applied.

## Verification

- `pnpm check`: passed all documentation/database/boundary/backend gates and 146/146 unit tests.
- `pnpm test:functional test/functional/attendance-sessions.test.ts`: 10/10 passed against real `vyapti_vschool_test`; covers scoped list/detail/revision reads, filters, other-Teacher empty result, foreign Branch denial, revoked membership denial and direct correction denial.
- `pnpm test:e2e test/e2e/teacher-attendance-milestone.spec.ts --project=chromium --grep='assigned classes|locates an authorized submitted register' --workers=1`: 2/2 passed on the rebuilt candidate.
- Same command with `--project=mobile` and the existing candidate: 2/2 passed. A later evidence-only selector refinement re-ran the assigned-class journey 1/1 on each project.
- The E2E production build passed (`.next-e2e/BUILD_ID` `yqgxn8xqZiHchWBN9tT7o`); the final sequential production build also passed (`.next/BUILD_ID` `OznR4blbfVrIiB3-2OYPi`).
- The first focused desktop history run selected a scheduled row because the earlier submission test was intentionally excluded. The fixture was corrected to establish a submitted register through the actual Attendance use cases and to select the submitted row by state; the corrected run passed. One mobile command used the nonexistent project name `mobile-chromium`; it performed no browser test and was immediately corrected to the configured `mobile` project.

JUnit reports are preserved as `unit.junit.xml` and `functional.junit.xml`.

## Visual comparison

The reference and application were captured at 1440×1050 and 390×844 and directly inspected, rather than inferred from overflow assertions:

- `reference-chromium.png`, `reference-mobile.png`
- `application-chromium.png`, `application-mobile.png`

The production screen matches the approved page title/copy, compact combined search, Filter/Sort actions, Session/Class/Status/Actions hierarchy, badges, row action, card conversion on mobile, footer note, sidebar selection, spacing and measured control sizes. The application intentionally uses authorized synthetic data, omits prototype review chrome, uses the real branch/account shell, and shows only school-local today-and-earlier history. The recorded reference-font portability deviation remains; exact cross-platform font matching and native VoiceOver/NVDA are untested.

The populated class-detail comparison is in `docs/evidence/teacher-classes-2026-10-13/application-detail-{chromium,mobile}.png`; it now includes the approved Assigned sessions card and Session history tab through the Attendance owner.

## Manual demo

1. Sign in as the assigned Teacher from the ignored `artifacts/people-02/private-demo.json` file and open **Attendance history**.
2. Search by Subject or choose Date / time and enter a `YYYY-MM-DD` school date. Use Filters for assigned class/status and Sort for date, subject or class. Expect URL state and only authorized results.
3. Open a Submitted row. Expect the frozen read-only roster plus **Receipt and revision history** and no correction control.
4. Open **My classes**, choose an assigned class and inspect **Assigned sessions** or **Session history**. Expect links to the same authorized Attendance records.

Human review, native accessibility, font portability, TEN-03 and production/provider gates remain pending.
