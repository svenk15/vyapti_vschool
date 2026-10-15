# PAR-18 pinned academic-calendar evidence — 16 October 2026

Source under test: the commit produced by this checkpoint (recorded after commit). Human review: **PENDING**.

## Contract and implementation

The Parent and Student weekly timetable projections now evaluate the effective immutable publication's pinned academic calendar for every civil date. The active dated SectionPlacement supplies the optional campus; the existing Academics rule applies campus exception, school exception, then weekly rule. The immutable day pattern must also contain the weekday. Browser values cannot select a calendar, campus, Section or tenant scope.

There is no schema or migration change. Both local databases remained at 62 applied migrations. Existing publications with no calendar pin retain pattern-only behavior; an unresolved non-null pin fails closed for that day.

## Verification

- `pnpm typecheck` — PASS.
- focused ESLint for the shared projection and changed functional/browser fixtures — PASS.
- Guardian real-PostgreSQL file — 6/6 PASS inside the repository run, including Friday closure omission and approved Saturday inclusion.
- Student portal real-PostgreSQL file — 5/5 PASS inside the same run, including the same calendar assertions and existing cross-Student/revocation checks.
- `VSCHOOL_E2E=1 pnpm build` — PASS.
- focused Chromium Playwright with one worker — 1/1 PASS.
- focused mobile Playwright with one worker — 1/1 PASS.
- normal `pnpm build`, `pnpm check:docs`, `pnpm check:boundaries`, and `pnpm check:backend` — PASS.

The initial PostgreSQL command accidentally included an extra `--` through the package wrapper and therefore ran all functional files. The changed Guardian and Student files passed, but the overall run was **FAILED** by two unrelated existing `attendance-explanations.test.ts` `NOT_FOUND` cases (175/177 tests passed). This broader run is not reported as a passing release gate and was not repeated unchanged.

## Visual comparison

The unchanged authority remains `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_Parent_Guardian_Design/VSchool_Parent_Guardian_Review.html#/flow/PAR-18`. It describes a generic staged calendar review and has no exact combined teaching/event read state. The already-recorded reference captures in `docs/evidence/parent-combined-calendar-par-18-2026-10-16/` were reused; historical images were preserved.

- [Desktop application](application-chromium.png): 1440×1000, five visible teaching days, Friday closure absent, Saturday extra day present, permitted event visible.
- [Mobile application](application-mobile.png): 390×844, the same five days in the responsive grid with the event below it.

Both new captures were directly inspected for hierarchy, spacing, overflow and readable mobile composition. Visual status remains **DIRECT_PARTIAL** because the reference has no matching operational state. Font portability, native accessibility, actual browser zoom, TEN-03 and human acceptance remain pending.
