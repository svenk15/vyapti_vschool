# UX-17 landing composition evidence

Status: Administrator production composition engineering-verified; five-workspace gallery compositions remain candidate references; human acceptance pending.

## Source and authority

- Source under test: working tree based on `a0794a5`; the focused commit is recorded after this evidence is staged.
- Standard build ID: `EMUQPELEMc4cYtgQ5pQ401tf3qbLRLu7jmJVx43GsO`, served at `http://127.0.0.1:3400` through `pnpm demo:start`.
- Isolated E2E build ID: `1tf3qbLRLu7jmJVx43GsO`, produced from the same source immediately before the focused runs.
- Development and test migration state: 119 applied migrations; this presentation slice added no schema or migration.
- Approved Administrator composition input: `docs/evidence/ux-revamp-06-admin-landing-2026-10-18/refined-forest-concept.png`.
- Production contract: `docs/execution/UX_REVAMP/ADMIN_LANDING_SPEC.md` and `LANDING_PAGES.md`.
- Candidate route: `/design-system#landing-references`. Teacher, Student, Parent and Principal entries are review candidates, not approved references or completed production integrations.

## Verified behavior

- The populated Administrator page uses one three-column summary surface, a 2:1 work grid, compact trailing attention links, semantic session table/mobile cards, the real publisher-authorized Events projection, four permission-filtered quick links and compact setup readiness.
- The unavailable test persona keeps Attendance and Events failures distinct from successful zero data.
- Root overflow is absent at 1440×1000, 1024×1000, 768×900 and 390×844 CSS pixels.
- Mobile summary rows stack, sessions become labelled cards, the navigation drawer traps focus and returns it on Escape, and the Communication group remains reachable above the fixed identity/sign-out footer.
- Computed Inter loaded. The measured desktop summary is 118px high, the main gap is 24px, browser scale is 1 and device pixel ratio is 1. These are CSS-viewport checks, not native browser zoom evidence.
- Forest, Amethyst, Porcelain and Linen use the same geometry with theme-resolved primary actions, ordinary links, icons, selected navigation, focus and progress.

## Checks

- `pnpm exec eslint app/admin/page.tsx components/landing-page.tsx components/landing-reference-gallery.tsx components/component-gallery.tsx test/e2e/landing-pages.spec.ts` — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm check:docs` — passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/landing-pages.spec.ts --project=chromium --workers=1` — 2/2 passed against real `vyapti_vschool_test` after 119 migrations.
- The same focused command with `--project=mobile` — 2/2 passed.
- `node scripts/verify-admin-landing-local.mjs` — passed against the populated development fixture and wrote `render-metrics.json` plus the four-theme/responsive captures in this directory.

The first focused run was invalid because `VSCHOOL_E2E_BUILT=1` reused an older `.next-e2e` artifact. No assertion was weakened. The isolated artifact was rebuilt from current source, after which both viewport projects passed.

## Direct visual inspection

- `after-forest-desktop.png` and `after-forest-mobile.png`: populated production page.
- `after-forest-tablet-1024.png` and `after-forest-tablet-768.png`: intermediate layouts.
- `after-forest-desktop-navigation-expanded.png` and `after-forest-mobile-navigation.png`: grouped navigation reachability and drawer state.
- `after-{forest,amethyst,porcelain,linen}-{desktop,mobile}.png`: same data and DOM under all four visual themes.
- `candidate-{chromium,mobile}.png`: deterministic gallery candidate using the same components.
- `admin-unavailable-{chromium,mobile}.png`: independent unavailable-projection state.

Direct inspection found the final hierarchy, action alignment, table density, calendar sizing, mobile stacking and sidebar/footer separation coherent. The seeded fixture has no event on 19 October, so the selected-day agenda truthfully says no published events while other days display real entry indicators.

## Remaining gaps

- Teacher, Student, Parent and Principal production pages do not yet consume the full shared landing composition. Their current owner-query gaps are recorded in `LANDING_PAGES.md`.
- The Administrator concept includes global search, notifications, a concept calendar and sample values that are outside current product/data authority; none were fabricated.
- Native VoiceOver/NVDA, actual-browser 200% zoom, human visual acceptance, TEN-03 and production release remain pending.
