# Administrator navigation and Forest palette closure

Captured 20 October 2026 (Asia/Kolkata). Human review remains **PENDING**.

## Provenance

- Theme correction: `2516efb` (`Restore semantic Administrator theme palette`).
- Navigation integration: `bf0fa93459dd01238bcee5e4737eb210408bfc2a` (`Complete Administrator local navigation integration`).
- Executable application source: `bf0fa93459dd01238bcee5e4737eb210408bfc2a`.
- Production build ID: `Tgo8wE8iiaLrT-xPiMiXP`.
- Demo: `http://127.0.0.1:3400` using the ignored credentials in `artifacts/people-02/private-demo.json`.
- Schema/migrations/seeds: unchanged by this checkpoint. The focused E2E harness found all 119 test-database migrations applied.

The first production build retained an obsolete generated CSS chunk while an older server shared `.next`. Its screenshots and computed values are deliberately retained as the before state in `browser-results-before.json`, `students-forest-before.png`, and `today-forest-before.png`. The server was stopped, `.next` was isolated outside the repository, and the clean build above was then captured. The clean compiled CSS contains the corrected semantic assignment and does not contain the obsolete Administrator sidebar assignment.

## Colour drift and correction

The accepted Concept 1 implementation scoped a literal mock treatment to `.administrator-portal-shell`: it changed the portal canvas from `--vs-canvas` to `--vs-surface`, the sidebar from `--vs-sidebar-*` to pale surface/text tokens, and the selected, hover, footer, account and focus treatments to content-area tokens. Theme persistence and institution/branch inheritance were not changed.

The correction retains the accepted 218px shell geometry and open directory composition while restoring:

- canvas `--vs-canvas` and top/content surfaces `--vs-surface`;
- sidebar `--vs-sidebar-bg`, `--vs-sidebar-text`, and `--vs-sidebar-muted`;
- selected/hover states `--vs-sidebar-active-bg` and `--vs-sidebar-active-text`;
- sidebar focus, dividers, account, utility and sign-out treatments derived from the sidebar tokens.

The UX specification now states that layout-reference approval does not authorize palette changes and semantic theme tokens take precedence over literal mock colours.

## Acceptance checklist

| Area | Implemented | Verification | Result / limits |
|---|---|---|---|
| Today | Direct primary item and active route retained | Authenticated broad persona; before/after desktop capture | VERIFIED for this presentation slice |
| Students | Directory, Admissions, Imports; contextual Register student action | Authenticated broad and restricted persona, desktop/mobile, URL/search/sort journey | VERIFIED |
| Staff | Profiles, Access, Availability from server-derived destinations | Broad persona and navigation unit fallback cases | IMPLEMENTED; a dedicated authenticated profiles-without-access fixture remains missing |
| Attendance | Registers, Explanations, Corrections, Report; primary href opens `?view=monitor` | Broad persona, current-source desktop/mobile capture, unit omission/fallback cases | IMPLEMENTED; a dedicated authenticated attendance-only fixture remains missing |
| Academics | Timetable, Classes & subjects, Teaching assignments, Assessments, Cover | Broad persona, desktop/mobile capture, unit fallback cases | IMPLEMENTED; no authenticated no-Timetable fixture was created |
| Communication | Notices and Calendar | Broad persona, desktop/mobile capture and focused keyboard/overflow probe | VERIFIED for broad persona |
| Settings | School setup, School details, Modules, Appearance, Activity | Broad persona, desktop/mobile capture and focused keyboard/overflow probe | VERIFIED for broad persona |
| Conditional School services | Existing owner-probed Facilities and Finance remain direct; empty groups remain hidden | Broad persona shows the currently authorized services; unit cases retain filtering | IMPLEMENTED; service-specific authorization evidence is reused from the owner modules |

Registration remains a focused page: `registrationLocalNav` is `0`, and Back to Students remains the navigation path. Account, branch/workspace context and Sign out remain utilities. No menu visibility is used as endpoint authorization.

## Focused verification

- `pnpm exec vitest run --config vitest.config.ts test/unit/branding.test.ts` — 21/21 passed.
- `pnpm exec vitest run --config vitest.config.ts test/unit/admin-navigation.test.ts test/unit/workspace-navigation.test.ts test/unit/branding.test.ts` — 28/28 passed.
- Focused ESLint over the changed source files — passed.
- `pnpm typecheck` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID `Tgo8wE8iiaLrT-xPiMiXP`.
- Authenticated broad-persona browser probe — passed at 1440×1000, 900×920, 390×844 and 360×800; all mapped local links were keyboard focusable, mobile Escape returned focus, and no root overflow was found.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/students-directory-gaps.spec.ts --project=chromium` — 1/1 passed against `vyapti_vschool_test`.
- The same focused E2E with `--project=mobile` — 1/1 passed.
- `pnpm check:docs` — failed only on two unrelated pre-existing dirty links to missing `docs/evidence/workspace-presentation-route-pass-2026-10-20/README.md`; this checkpoint did not change those files.

The authenticated probe measured Forest as sidebar `rgb(24, 61, 51)`, active background `rgb(43, 88, 74)`, canvas `rgb(246, 248, 245)`, and white content surface. Amethyst, Porcelain and Linen produced distinct sidebar, active and canvas values in `browser-results.json`. Computed headings use the bundled Inter family.

## Visual evidence

- Before: [Students](students-forest-before.png), [Today](today-forest-before.png), [computed values](browser-results-before.json).
- Corrected Forest: [Students](students-forest-desktop.png), [Today](today-forest-desktop.png), [Staff](staff-forest-desktop.png), [Attendance](attendance-forest-desktop.png), [Academics](academics-forest-desktop.png), [Communication](communication-forest-desktop.png), [Settings](settings-forest-desktop.png), [focused registration](registration-forest-desktop.png).
- Responsive: 900, 390 and 360 captures for Students, Attendance, Academics, Communication and Settings, plus [open mobile navigation](sidebar-forest-mobile.png).
- Other themes: [Amethyst](students-amethyst-desktop.png), [Porcelain](students-porcelain-desktop.png), and [Linen](students-linen-desktop.png).

The final captures were directly inspected for palette, hierarchy, local-link selection, clipped controls, sidebar/footer clearance and mobile composition. Native VoiceOver/NVDA and actual browser 200% zoom were not performed. Branch-context refresh, revoked-session navigation refresh, import-only access, attendance-only access, profiles-without-access and no-Timetable authenticated personas remain specific browser-evidence gaps; server authorization and existing owner tests remain in force.
