# Administrator home visual fidelity

Compared on 10 October 2026 against the unchanged approved Administrator reference `VSchool_School_Admin_Review.html#/home` at 1440 × 1000 and 390 × 844 CSS pixels. Human visual acceptance remains **PENDING**.

| Viewport | Approved reference | Application |
|---|---|---|
| Desktop | [reference](reference-desktop.png) | [application](application-desktop.png) |
| Mobile | [reference](reference-mobile.png) | [application](application-mobile.png) |

The application now follows the approved Today hierarchy: one school-day heading and setup action, three compact operational metrics, a worklist with source actions, a current-session list, setup progress and compact quick actions. Values come from existing authorized Reporting, Attendance, Student and setup projections. Empty states remain truthful when the current school-local day has no sessions or exceptions. Prototype review chrome, fictional personal identity, fake counts and fake academic-year context are excluded.

Focused verification:

- `pnpm exec eslint app/admin/page.tsx test/e2e/access.spec.ts` passed.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- `pnpm test:e2e test/e2e/access.spec.ts --grep "administrator signs in"` passed 2/2 desktop/mobile against `vyapti_vschool_test` with 38 migrations applied and none pending. The journey covers sign-in, current scope, foreign-school denial, setup navigation, return navigation, sign-out and protected-route redirect.
- Playwright screenshot inspection found no horizontal overflow at 1440px or 390px.

No schema, migration, authorization, seed or development-database row changed.
