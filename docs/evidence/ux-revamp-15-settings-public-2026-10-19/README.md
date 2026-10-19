# UX-15 settings and public-entry checkpoint

Date: 19 October 2026 (Asia/Kolkata)

## Outcome

- Branding management now offers the four approved public presets: Refined Forest, Amethyst & Pearl, Porcelain & Ink and Linen & Bronze.
- A forward migration expands the `vs_branding_brand_revision` palette constraint while retaining stored `indigo` and `clay` history. It rewrites no revision and does not change publication authority or immutability.
- The existing branch-authorized draft, preview, save, publish, rollback and publisher-revocation transactions are unchanged.
- The focused journey publishes Porcelain, reads it through the sanitized no-store public projection, opens the real `/sign-in/:slug` credentials flow, confirms the preview-only “Authentication is not connected” warning is absent, signs in and resolves the authorized branch.
- Browser institution creation remains unavailable by accepted Access design: there is no authenticated platform-operator browser principal. The verified local operator command already accepts the optional four-theme `themeId`. Adding an operator UI requires a separate authenticated operator authority contract.

## Provenance

- Parent source: `f4eaaa6` plus the focused UX-15 diff committed with this record.
- Standard production build: `gwOGU0wNUxhZJu8bXYfIK` with the established 4 GiB Node heap.
- Isolated browser build: `GlqoGrwyI0cfO3EqP_gT1`.
- Development and test databases: 119 forward migrations through `20261019074000_branding_theme_presets`; neither database was reset and no applied migration was edited.

## Verification

- Focused ESLint for Branding component and affected functional/browser specs — passed.
- `pnpm exec tsc --noEmit` — passed.
- `pnpm check:db-design` — passed with 204 registered table contracts.
- Real-PostgreSQL Branding publication — 3/3 passed, including Porcelain persistence/public projection, immutable history, replay/concurrency, wrong scope and current publisher revocation.
- The first attempted focused functional invocation included an extra `--`; the repository wrapper forwarded it in a way that ran the full functional suite. That valid but unplanned run passed 51 files / 270 tests. It was not rerun.
- Porcelain publish → real branded sign-in → authenticated branch journey, Chromium at 1440×1000 — 1/1 passed.
- The same journey, Mobile Chromium at 390×844 — 1/1 passed.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — passed, build `gwOGU0wNUxhZJu8bXYfIK`.

## Direct visual inspection

`branding-published-{chromium,mobile}.png` shows the authorized settings workspace with Porcelain selected and revision 1 published. `branded-sign-in-{chromium,mobile}.png` shows the same immutable published identity on the real credentials route. The captures were inspected for font, responsive stacking, field/action alignment, theme application and overflow. The live sign-in clearly differs from sample preview routes: it prompts for the school-provided account and has no disconnected-authentication warning.

## Status and gates

UX-15 is PARTIAL because the browser institution-creation item requires the missing platform-operator browser identity/authorization contract documented in Access DESIGN. Porcelain publication and real branded sign-in are engineering-verified. Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain pending.
