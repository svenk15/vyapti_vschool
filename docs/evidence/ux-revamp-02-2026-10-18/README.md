# UX-02 semantic presentation evidence

Recorded 18 October 2026 (Asia/Kolkata). The tested source is the focused UX-02 checkpoint containing this record, based on UX-01 commit `b13260877e622b59f1035fd648ea7c15f7cf7517`. Isolated production build ID: `T3DqzOo_E2m5evJmzBHGd`.

## Outcome

- Added the four approved semantic themes and safe public identifiers: Forest, Amethyst, Porcelain, and Linen.
- Bundled official Inter 4.1 variable WOFF2 and its SIL Open Font License. SHA-256: `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`; license SHA-256: `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a`.
- Replaced presentation-time inline palette styles with validated `data-vs-theme` attributes and semantic variables. Unknown reads fail safely to Forest.
- Preserved pre-UX-03 persistence: stored `indigo` projects to Amethyst and stored `clay` projects to Linen. No schema, applied migration, write authorization, publication transaction, or immutable revision changed.
- Reused shared SVG icon paths for the portal menu, close control, and default empty state.
- Fixed a confirmed 390px overflow in shared form grids and constrained table overflow to its keyboard-focusable region.

## Verification

- `pnpm exec vitest run test/unit/branding.test.ts --reporter=default` — 21 passed.
- `pnpm exec vitest run test/unit/branding.test.ts test/unit/branding-pipeline.test.ts test/unit/portal-navigation.test.ts` — 25 passed across the resolved files.
- `pnpm check:backend` — passed.
- `pnpm typecheck` — passed.
- `pnpm test:functional branding-publication.test.ts` — 3 passed against `vyapti_vschool_test`; 117 migrations current. Covers publication/rollback projection, concurrent publishers, replay-sensitive authority, and revocation.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e design-system.spec.ts --project=chromium --grep 'gallery supports all approved themes'` — 1 passed with one worker at 1440×1000.
- The same focused command with `--project=mobile` — 1 passed with one worker at 390×844 after the overflow correction.
- `VSCHOOL_E2E=1 NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed; Next.js 16.3.8 production compilation, type checking, static generation, and route collection completed.

An initial unfiltered design-system file run passed the first three scenarios, including the theme capture, then stalled in an unchanged later controlled-list scenario after the demo server logged a closed destination stream. It was interrupted and is not reported as passed. The supported narrowed commands above establish the UX-02 changed behavior.

## Visual inspection

Desktop and mobile full-page captures were inspected directly. Theme colors change consistently while semantic success/warning/danger/info states remain stable. Inter is the computed body family. Headings, controls, cards, directories, feedback, workspace preview, and authentication composition retain hierarchy and readable spacing. At 390px, forms stack within the card, the page has no horizontal overflow, and the table remains intentionally scrollable inside its focusable region.

| Theme | 1440×1000 application | 390×844 application |
|---|---|---|
| Refined Forest | [desktop](gallery-forest-chromium.png) | [mobile](gallery-forest-mobile.png) |
| Amethyst & Pearl | [desktop](gallery-amethyst-chromium.png) | [mobile](gallery-amethyst-mobile.png) |
| Porcelain & Ink | [desktop](gallery-porcelain-chromium.png) | [mobile](gallery-porcelain-mobile.png) |
| Linen & Bronze | [desktop](gallery-linen-chromium.png) | [mobile](gallery-linen-mobile.png) |

## Remaining gates

Human visual acceptance is PENDING. UX-03 persistence migration/inheritance is not implemented. Native VoiceOver/NVDA, real browser 200% zoom, TEN-03 restricted-role/RLS evidence, provider/deployment configuration, real-client data authorization, and production release remain open.
