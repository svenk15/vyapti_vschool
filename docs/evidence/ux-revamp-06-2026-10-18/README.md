# UX-06 shared shell and Administrator evidence

Date: 18 October 2026 (Asia/Kolkata)

Implementation source: `d536d38`.

Migration state: development and test remain at 118 applied migrations; UX-06 adds no migration.

## Verified behavior

- The protected portal uses the effective theme's semantic sidebar, content, border, action and focus values. The shared desktop sidebar is 240 CSS pixels and the top bar is 64 CSS pixels.
- Administrator navigation exposes Today as a direct route rather than a group containing another Today. Existing destinations remain server filtered, independently protected and grouped without changing route or capability contracts.
- The mobile navigation becomes a modal drawer below 1024 CSS pixels. It locks the background, exposes dialog semantics, traps focus with the existing shell behavior, closes with Escape/backdrop activation and restores focus to the menu trigger.
- Today uses authoritative metrics, exceptions, sessions, setup progress and quick actions. Empty and module-unavailable states remain accurate.
- Students preserves server search, filters, deterministic sorting, cursor pagination, URL history and branch scope. Desktop uses the approved table composition; mobile uses labelled record cards. Sort and Manage surfaces retain focus return.
- Registration keeps the four approved stages, exact Person-ID/admission-number identity resolution, in-flow state and final-confirmation write. The unsupported durable draft action is absent.

## Checks

- `pnpm exec eslint app/globals.css components/portal/portal-shell.tsx components/student-registration-workflow.tsx components/students-workspace.tsx lib/server/admin-navigation.ts test/e2e/access.spec.ts test/e2e/students-directory-gaps.spec.ts` — passed for lintable files.
- `pnpm typecheck` — passed.
- `pnpm check:docs` — passed.
- `pnpm check:boundaries` — passed.
- `pnpm check:backend` — passed.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed for the isolated E2E application.
- Students directory, URL-backed search/sort and all supported Manage destinations — Chromium 1/1 and mobile 1/1 passed, sequentially with one worker.
- Student registration and result search — Chromium 1/1 and mobile 1/1 passed, sequentially with one worker.
- Administrator shell, Today, authorization, 1024/768 breakpoints, mobile drawer Escape/focus restoration and sign-out — Chromium 1/1 passed on final test/source; mobile 1/1 passed on the same application source before the desktop-only intermediate assertions were added.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed for the standard application; build ID is recorded in the resume document.
- The populated development Today page was captured through the real signed-in application using the existing fictional `pnpm demo:seed` data. No totals or records were injected into the browser.

The first Students journey runs exposed stale expected URLs for existing Manage actions; the assertions were reconciled to the current dedicated transfer route and preserved `returnTo` fragments. The first Today run exposed the duplicated Today group and a stale assumption that School setup was always expanded. The source navigation and focused assertion were corrected before the passing runs. No timeout, route, authorization or business assertion was weakened.

## Direct visual inspection

Approved source: `docs/execution/VSchool_Execution_Pack/references/approved/packs/VSchool_School_Admin_Design/VSchool_School_Admin_Review.html`, with production screen rules under `implementation-spec/administrator/`.

- [Students reference desktop](reference-students-desktop.png) / [application desktop](application-students-desktop.png) and [reference mobile](reference-students-mobile.png) / [application mobile](application-students-mobile.png).
- [Sort reference desktop](reference-students-sort-desktop.png) / [application desktop](application-students-sort-desktop.png) and [reference mobile](reference-students-sort-mobile.png) / [application mobile](application-students-sort-mobile.png).
- [Registration reference desktop](reference-registration-desktop.png) / [application desktop](application-registration-desktop.png) and [reference mobile](reference-registration-mobile.png) / [application mobile](application-registration-mobile.png).
- [Today populated reference](reference-today-desktop.png) / [application populated desktop](application-today-populated-desktop.png) and [application populated mobile](application-today-populated-mobile.png). The earlier [empty desktop](application-today-desktop.png) and [empty mobile](application-today-mobile.png) captures remain evidence of the genuine unavailable/empty state and are not presented as populated matches.
- [Computed Students metrics and rendered font provenance](students-metrics.json) show 28px/36px heading text, 14px/22px table text, 400px desktop drawer, no root overflow and actual `Inter Variable` glyph rendering.

The images were inspected directly for hierarchy, density, alignment, action placement, drawer dimensions, card/table conversion and overflow. Differences retained by contract are the server-filtered navigation catalogue, real fictional fixture counts/names, supported additional Student actions, absence of unsupported durable drafts and the mobile stepper wrapping rather than clipping. These are recorded contract differences, not exact-pixel claims.

## Outstanding gates

Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, four-theme route coverage, UX-07 cross-workspace composition, TEN-03 restricted-role/RLS proof and production release remain pending.
