# UX-06 Administrator landing composition correction

Date: 19 October 2026 (Asia/Kolkata)

Scope: `/admin` presentation and navigation usability only. No API, authorization, persistence, migration, session-selection, sorting or pagination contract changed. Human visual acceptance remains **PENDING**.

## Provenance

- Recovered implementation checkpoint: `dd97e8899503760a9d6f129c899216097850a9d6` on `work/stu-01-after-per02-wip`.
- Executable source: that checkpoint plus the focused completion files in the commit containing this record.
- Standard production build ID: `Lfb4Yx1MIYLgm6KGEB9us`.
- Development/test database migration state: unchanged; this slice adds no schema or migration.
- Demo: `http://127.0.0.1:3400/admin` using the existing fictional `artifacts/people-02/private-demo.json` credential source. Credentials are not included in this evidence.
- Composition authority: the user-supplied [Refined Forest concept](refined-forest-concept.png) plus the explicit `/admin` composition contract. Existing application data and permission filtering remain authoritative.

The browser-control plugin could not initialize because its generated worker referenced a missing older bundled-browser path. The final inspection therefore used the repository's installed Playwright Chromium, the same browser engine required by the repository tests.

## Direct comparison

| State | Desktop 1440×1000 | Mobile 390×844 |
|---|---|---|
| Before, served UX-08 candidate | [capture](before-desktop.png) | [capture](before-mobile.png) |
| Corrected Forest | [capture](after-forest-desktop.png) | [capture](after-forest-mobile.png) |
| Expanded navigation | [capture](after-forest-desktop-navigation-expanded.png) | [open drawer](after-forest-mobile-navigation.png) |
| Final page section | [capture](after-forest-desktop-final-section.png) | Included in the full-page corrected capture |

The intermediate layouts are recorded at [1024px](after-forest-tablet-1024.png) and [768px](after-forest-tablet-768.png).

[Before metrics](before-metrics.json) and [corrected metrics](render-metrics.json) record CSS viewport size, visual viewport scale, device pixel ratio, computed font, root overflow, summary dimensions, grid columns, responsive table/card state, focus checks and sidebar/footer geometry. `visualViewport.scale = 1`, `devicePixelRatio = 1`, and computed document zoom `1` mean Playwright default page zoom. This is neither native Chromium UI zoom evidence nor device-scale emulation.

The corrected desktop view has one 122px summary surface with three 378px columns. Its main grid resolves to 741.328px / 370.656px with a 24px gap. The mobile view has no horizontal root overflow, stacks the three metrics, and replaces the desktop session table with labelled session cards. The historical before capture is the same fictional Administrator persona and viewport, but its branch-local date was 18 October; the final current-source capture is 19 October and therefore reflects the current owner projections. No record was rewritten to force identical counts. Composition and geometry are directly comparable; exact data-state parity is a recorded evidence limitation.

## Corrected composition

- Replaced the generic heading with “Your school day, at a glance”, the branch-local date and one readable branch context.
- Added the authorized Register student primary action and retained School setup as the secondary route.
- Replaced three large metric cards with one equal-column summary surface using the existing submitted-register, active-student and attention projections.
- Kept category count separate from the underlying issue count.
- Moved Today’s sessions to the left column and rendered the authorized projection as a semantic desktop table; mobile uses labelled cards with the same destinations.
- Put authorized directory/report/settings links in Quick access and kept truthful setup readiness compact in the right column. Completed items are no longer repeated as success badges; every unresolved requirement remains named with its owner-supplied explanation.
- Preserved the server-filtered sidebar catalogue and grouping. Rows remain at least 44px with independent navigation scrolling; the Communication group was confirmed visible and above the fixed account footer.
- Verified that the existing account display fallback shows the role when this synthetic account has no separate human display name. No name was invented.

No authorized calendar/event projection is part of the current Administrator Today DTO. The concept calendar remains an approved data-dependent deviation; this correction did not introduce a calendar owner or fabricate events.

## Four-theme inspection

Each pair below uses the same authorized server data, DOM and viewport. A visual-only `data-vs-theme` override exercises the four approved semantic token sets without changing stored institution/branch configuration; UX-03/UX-04/UX-08 retain the persistence and inheritance evidence.

| Theme | Desktop | Mobile |
|---|---|---|
| Forest | [capture](after-forest-desktop.png) | [capture](after-forest-mobile.png) |
| Amethyst | [capture](after-amethyst-desktop.png) | [capture](after-amethyst-mobile.png) |
| Porcelain | [capture](after-porcelain-desktop.png) | [capture](after-porcelain-mobile.png) |
| Linen | [capture](after-linen-desktop.png) | [capture](after-linen-mobile.png) |

All captures were inspected directly for hierarchy, alignment, spacing, action priority, dividers, session density, sidebar reachability and mobile wrapping. Inspection found and corrected two concrete token defects: summary icons lost the themed primary colour to a more-specific muted-copy selector, and generic action links/progress inherited the root Forest alias in non-Forest surfaces. The final computed evidence now matches each theme for primary actions, ordinary and session action links, non-status icons, selected navigation, focus rings and progress. Semantic warning/status colours remain independent. The application retains the complete authorized navigation catalogue, real synthetic counts/names and the compact setup status; these product-data differences remain visible.

## Shared-shell regression

[The current-source report](shared-shell-regression.json) verifies Administrator, Teacher, Principal, Parent and Student at 1440×1000 and 390×844. Every desktop shell has Inter, no root overflow, an independently scrollable navigation area, 44px minimum visible rows, and a visible identity/sign-out footer. Every mobile drawer receives focus, keeps its footer visible, closes with Escape and returns focus to the opener.

| Workspace | Desktop | Mobile |
|---|---|---|
| Teacher | [capture](shared-shell-teacher-desktop.png) | [capture](shared-shell-teacher-mobile.png) |
| Principal | [capture](shared-shell-principal-desktop.png) | [capture](shared-shell-principal-mobile.png) |
| Parent | [capture](shared-shell-parent-desktop.png) | [capture](shared-shell-parent-mobile.png) |
| Student | [capture](shared-shell-student-desktop.png) | [capture](shared-shell-student-mobile.png) |

These are regression observations of the shared shell. They do not complete or visually accept the four workspace page-composition backlogs.

## Verification

- `pnpm exec eslint app/admin/page.tsx scripts/verify-admin-landing-local.mjs scripts/verify-demo-personas.mjs --no-warn-ignored` — passed.
- `pnpm typecheck` — passed.
- `pnpm check:docs`, `pnpm check:boundaries`, and `pnpm check:backend` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed against the final source; build ID `Lfb4Yx1MIYLgm6KGEB9us`.
- `node scripts/verify-admin-landing-local.mjs` — passed against that served build. It asserts 390, 768, 1024 and 1440 CSS-pixel layouts, loaded Inter, the summary/grid geometry, desktop table/mobile cards, no root overflow, exact semantic theme application, CTA keyboard order, unresolved setup visibility, desktop navigation reachability and mobile drawer focus containment/return.
- `VSCHOOL_CAPTURE_PERSONAS=1 node scripts/verify-demo-personas.mjs` — passed 11 current-source persona/recovery states sequentially, including the five workspace shells at desktop/mobile.
- The earlier `pnpm test:e2e -- test/e2e/access.spec.ts --project=chromium --workers=1` attempt remains **not passed**: its guarded isolated E2E web-server build did not become ready within 300 seconds, so no spec ran. It is retained as a harness timeout, not presented as evidence. The focused current-build Playwright checks above passed.

Native VoiceOver/NVDA, native-browser 200% zoom, human visual acceptance, TEN-03 and production release remain pending. Separate backlog items remain: Principal, Parent, Teacher and Student page composition; browser institution-creation theme selection; Porcelain published sign-in support; and verification of the branded sign-in capture labelled “Authentication is not connected”.
