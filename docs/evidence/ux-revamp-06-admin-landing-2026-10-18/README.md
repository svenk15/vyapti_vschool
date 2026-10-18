# UX-06 Administrator landing composition correction

Date: 18 October 2026 (Asia/Kolkata)

Scope: `/admin` presentation and navigation usability only. No API, authorization, persistence, migration, session-selection, sorting or pagination contract changed. Human visual acceptance remains **PENDING**.

## Provenance

- Parent HEAD: `d9e4799aabcf4f587715748553399c0caae6deb8` on `work/stu-01-after-per02-wip`.
- Executable source: the parent plus the focused Administrator landing files in the commit containing this record.
- Standard production build ID: `UAN_bJ2MGUKTq2k5wmiwG`.
- Development/test database migration state: unchanged; this slice adds no schema or migration.
- Demo: `http://127.0.0.1:3400/admin` using the existing fictional `artifacts/people-02/private-demo.json` credential source. Credentials are not included in this evidence.
- Composition authority: the user-supplied [Refined Forest concept](refined-forest-concept.png) plus the explicit `/admin` composition contract. Existing application data and permission filtering remain authoritative.

The browser-control plugin could not initialize because its generated worker referenced a missing older bundled-browser path. The final inspection therefore used the repository's installed Playwright Chromium, the same browser engine required by the repository tests.

## Direct comparison

| State | Desktop 1440×1000 | Mobile 390×844 |
|---|---|---|
| Before, served UX-08 candidate | [capture](before-desktop.png) | [capture](before-mobile.png) |
| Corrected Forest | [capture](after-forest-desktop.png) | [capture](after-forest-mobile.png) |
| Mobile navigation | — | [open drawer](after-forest-mobile-navigation.png) |

[Before metrics](before-metrics.json) and [corrected metrics](render-metrics.json) record CSS viewport size, visual viewport scale, device pixel ratio, computed font, root overflow, summary dimensions, grid columns, responsive table/card state, focus checks and sidebar/footer geometry. `visualViewport.scale = 1`, `devicePixelRatio = 1`, and computed document zoom `1` mean Playwright default page zoom. This is neither native Chromium UI zoom evidence nor device-scale emulation.

The corrected desktop view has one 122px summary surface with three 378px columns. Its main grid resolves to 741.328px / 370.656px with a 24px gap. The mobile view has no horizontal root overflow, stacks the three metrics, and replaces the desktop session table with labelled session cards.

## Corrected composition

- Replaced the generic heading with “Your school day, at a glance”, the branch-local date and one readable branch context.
- Added the authorized Register student primary action and retained School setup as the secondary route.
- Replaced three large metric cards with one equal-column summary surface using the existing submitted-register, active-student and attention projections.
- Kept category count separate from underlying issue count (`3 categories · 13 issues` in this fixture).
- Moved Today’s sessions to the left column and rendered the authorized projection as a semantic desktop table; mobile uses labelled cards with the same destinations.
- Put authorized directory/report/settings links in Quick access and kept truthful setup readiness compact in the right column.
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

All captures were inspected directly for hierarchy, alignment, spacing, action priority, dividers, session density, sidebar reachability and mobile wrapping. The application retains the complete authorized navigation catalogue, real synthetic counts/names and the compact setup status; these intentional product-data differences remain visible.

## Verification

- `pnpm exec eslint app/admin/page.tsx scripts/verify-admin-landing-local.mjs test/e2e/access.spec.ts test/e2e/access-management.spec.ts --no-warn-ignored` — passed.
- `pnpm typecheck` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; build ID `UAN_bJ2MGUKTq2k5wmiwG`.
- `node scripts/verify-admin-landing-local.mjs` — passed against the served production build. It asserts the two required viewports, loaded Inter, one summary strip, 112–128px desktop summary height, 24px grid gap, desktop table/mobile cards, no root overflow, distinct theme tokens, CTA keyboard order, mobile drawer focus containment/return, and Communication reachability above the footer.
- `pnpm test:e2e -- test/e2e/access.spec.ts --project=chromium --workers=1` — **not passed**: the guarded test database was current with 118 migrations, but Playwright's isolated E2E web-server build did not become ready within 300 seconds, so no spec ran. This is recorded as a harness/build timeout and is not presented as a test pass. The focused production-build browser verifier above completed after the timeout.

Native VoiceOver/NVDA, native-browser 200% zoom, human visual acceptance, TEN-03 and production release remain pending.
