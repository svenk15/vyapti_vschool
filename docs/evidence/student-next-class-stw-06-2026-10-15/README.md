# STW-06 Student next-class checkpoint

Date: 15 October 2026. Human review: **PENDING**.

## Selection and contract

The 47-workflow technical-design backlog was narrowed by shared owner capability. STW-06's next-class subset was the smallest ready slice: exact Student self-access, active dated placement and the TT-06 published weekly projection were already verified, and the approved Student `#/home` reference defines the user outcome. No new product lifecycle or authority rule was required. Full STW-06 remains partial because Learning-owned prioritized work is absent.

Two smaller-looking candidates were not ready. STW-44 selective session revocation lacks approved remote-reauthentication, device-label provenance and retention rules for the current stateless JWT design. Calendar/event reads lack an approved audience/event publication owner. Technical design itself is not treated as an approval gate; those concrete missing product/owner contracts are the blockers. Attendance explanation retention/visibility was not implemented.

Narrow LLD and acceptance criteria are in `docs/modules/academics/DESIGN.md` and `TASKS.md`. The existing timetable verifier and DTO remain unchanged; there is no migration.

## Reference and comparison

- Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Student_Design/VSchool_Student_Review.html#/home`
- Approved captures reused: `docs/evidence/student-workspace-2026-10-14/reference-home-desktop.png` and `reference-home-mobile.png`
- Current application: `application-chromium.png` and `application-mobile.png` in this directory

The images were inspected directly. The populated card now matches the approved dark composition, uppercase eyebrow, subject/time/teacher hierarchy, inset action and mobile ordering. Real Student/school/class values replace prototype fixtures. Room/change details are absent because no room/change owner projection exists. Learning, updates and request cards remain separate unimplemented capabilities. The recorded font-portability difference remains.

## Verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/student-next-class.test.ts` — 2/2 passed.
- `pnpm typecheck` — passed after the final source change.
- `pnpm check:backend`, `pnpm check:boundaries`, `pnpm check:docs` — passed.
- Current `.next-e2e` production build — passed.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e student-portal.spec.ts --project=chromium --workers=1` — 1/1 passed against `vyapti_vschool_test` with 48 applied migrations.
- Equivalent mobile command — 1/1 passed.

The browser journey used a real published revision, slot, offering, dated Teacher assignment and linked planned occurrence. It exercised Administrator authorization, Student activation, exact-context access, populated next class, keyboard focus, timetable navigation, cross-context switching and scoped revocation. Native VoiceOver/NVDA, actual browser zoom, TEN-03 and human acceptance remain pending.

`pnpm demo:seed` preserved the Timetable and Student portal fixtures and refreshed their supported records. Its unrelated optional TEN-02, ACA-01 and Branding refreshes reported their pre-existing `NOT_FOUND`/`CONFLICT` fixture problems and preserved existing data; they are not recorded as passing. A read-only check found that the primary Student persona has an active placement but no remaining trusted published occurrence on 15 October, so the live demo correctly shows the no-more-classes state today. The populated state is proven in the isolated current-source PostgreSQL browser fixture; no historical publication or occurrence was rewritten merely to make the date-sensitive demo populated.
