# UX-17 landing composition evidence

Status: five protected production landing compositions engineering-verified within their supported owner contracts; gallery compositions remain candidate references; human acceptance pending.

## Source and authority

- Source under test: working tree based on `d31411c`; the focused multi-workspace commit is recorded after this evidence is staged.
- Final standard build ID: `KHDj7BWHk8qO5UYriOnkC`, served at `http://127.0.0.1:3400` through `pnpm demo:start`.
- Isolated E2E build ID: `1tf3qbLRLu7jmJVx43GsO`, produced from the same source immediately before the focused runs.
- Development and test migration state: 119 applied migrations; this presentation slice added no schema or migration.
- Approved Administrator composition input: `docs/evidence/ux-revamp-06-admin-landing-2026-10-18/refined-forest-concept.png`.
- Production contract: `docs/execution/UX_REVAMP/ADMIN_LANDING_SPEC.md` and `LANDING_PAGES.md`.
- Candidate route: `/design-system#landing-references`. Teacher, Student, Parent and Principal gallery entries are review candidates rather than approved exact references; their production integrations were reviewed as shared-recipe implementations.

## Verified behavior

- The populated Administrator page uses one three-column summary surface, a 2:1 work grid, compact trailing attention links, semantic session table/mobile cards, the real publisher-authorized Events projection, four permission-filtered quick links and compact setup readiness.
- The unavailable test persona keeps Attendance and Events failures distinct from successful zero data.
- Root overflow is absent at 1440×1000, 1024×1000, 768×900 and 390×844 CSS pixels.
- Mobile summary rows stack, sessions become labelled cards, the navigation drawer traps focus and returns it on Escape, and the Communication group remains reachable above the fixed identity/sign-out footer.
- Computed Inter loaded. The measured desktop summary is 118px high, the main gap is 24px, browser scale is 1 and device pixel ratio is 1. These are CSS-viewport checks, not native browser zoom evidence.
- Forest, Amethyst, Porcelain and Linen use the same geometry with theme-resolved primary actions, ordinary links, icons, selected navigation, focus and progress.
- Teacher, Parent, Student and Principal production pages use the same shared geometry at 1440×1000 and 390×844. Parent and Student retain their exact selected contexts and scoped Events projections. Teacher and Principal show the explicit Calendar unavailable state because an authorized Events reader does not exist for those workspaces.
- The persona browser check passed 11/11 protected/public states, including two authorized Parent contexts, two authorized Student contexts, independent desktop sidebar scrolling, mobile drawer focus/return, permission-filtered quick access and no document-root overflow.

## Checks

- `pnpm exec eslint app/admin/page.tsx components/landing-page.tsx components/landing-reference-gallery.tsx components/component-gallery.tsx test/e2e/landing-pages.spec.ts` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm check:docs` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/landing-pages.spec.ts --project=chromium --workers=1` — 2/2 passed against real `vyapti_vschool_test` after 119 migrations.
- The same focused command with `--project=mobile` — 2/2 passed.
- `node scripts/verify-admin-landing-local.mjs` — passed against the populated development fixture and wrote `render-metrics.json` plus the four-theme/responsive captures in this directory.
- `VSCHOOL_CAPTURE_PERSONAS=1 VSCHOOL_PERSONA_OUTPUT=docs/evidence/ux-revamp-17-landings-2026-10-19/personas pnpm demo:verify-personas` — passed 11/11 against the current executable development source; measurements are in `personas/persona-verification.json`.

The first focused run was invalid because `VSCHOOL_E2E_BUILT=1` reused an older `.next-e2e` artifact. No assertion was weakened. The isolated artifact was rebuilt from current source, after which both viewport projects passed.

## Direct visual inspection

- `after-forest-desktop.png` and `after-forest-mobile.png`: populated production page.
- `after-forest-tablet-1024.png` and `after-forest-tablet-768.png`: intermediate layouts.
- `after-forest-desktop-navigation-expanded.png` and `after-forest-mobile-navigation.png`: grouped navigation reachability and drawer state.
- `after-{forest,amethyst,porcelain,linen}-{desktop,mobile}.png`: same data and DOM under all four visual themes.
- `candidate-{chromium,mobile}.png`: deterministic gallery candidate using the same components.
- `admin-unavailable-{chromium,mobile}.png`: independent unavailable-projection state.
- `personas/{administrator,teacher,parent,student,principal}-{desktop,mobile}.png`: populated current production entries using identical 1440×1000 and 390×844 CSS viewports.

Direct inspection found the five final hierarchies, action alignment, table density, calendar sizing, mobile stacking and sidebar/footer separation coherent. The seeded fixture has no event on 19 October, so the selected-day agenda truthfully says no published events while other days display real entry indicators.

## Remaining gaps

- Teacher and Principal do not have authorized Events readers. Teacher also lacks the bounded Learning feedback-attention aggregate; Principal lacks the bounded cross-owner landing composition. Student lacks complete due/unread/notice landing aggregates, and Parent lacks the consolidated acknowledgement/deadline/notice aggregate. These are owner-query gaps and the UI does not infer zeros.
- The Administrator concept includes global search, notifications, a concept calendar and sample values that are outside current product/data authority; none were fabricated.
- Native VoiceOver/NVDA, actual-browser 200% zoom, human visual acceptance, TEN-03 and production release remain pending.
