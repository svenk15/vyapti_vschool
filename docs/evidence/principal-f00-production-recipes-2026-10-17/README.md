# Principal F00 production recipe evidence

F00 reconciles the Principal completion package with executable source `f75ad4f3e3b036132d0c72bbe6c95eceea296b1c`, build ID `dzbFDU1W0dZo_wYNuvjwH`. No product code, schema or database data changed.

## Current-source capture

A focused headless Chromium session signed into the existing synthetic Principal persona and opened normal production routes without issuing a mutation. Desktop and mobile were run sequentially using 1440×1000 and 390×844 viewports.

- Recipe L: `recipe-l-desktop.png`, `recipe-l-mobile.png`.
- Recipe D: `recipe-d-desktop.png`, `recipe-d-mobile.png`.
- Recipe W: `recipe-w-details-*` and `recipe-w-review-*`.
- Recipe R: `recipe-r-desktop.png`, `recipe-r-mobile.png`.
- `measurements.json` records computed shell, title, gutter, declared font and overflow observations.

The first capture attempt was blocked by the filesystem sandbox before Chromium started. The approved external run succeeded. The first successful run exposed only a capture issue: the sticky mobile topbar appeared at the current scroll offset in a full-page review image. The capture was repeated after resetting scroll to the document start; application code did not change between runs.

## Direct inspection

All ten final images were inspected. Desktop preserves the 240px sidebar, 60px topbar, 32px content gutter and 28px title. Mobile uses the 64px compact header, 18px effective gutter within the approved 20±2px tolerance, full-width task actions and stacked cards/records. Every measured recipe reports no horizontal overflow.

The explorer is compared for workflow semantics, stages and states. Production uses normal routes, the persistent Principal shell and durable receipts. This mapping is recorded in [SCREEN_MAP](../../execution/PRINCIPAL_COMPLETION_PACK/SCREEN_MAP.md); it is not a claim of pixel identity with the fictional catalogue dialog.

## Verification provenance

- Current-source browser capture and computed-style measurement: passed for L/D/W/R at both viewports.
- Existing F01/WF-10 evidence remains [LEA-10](../principal-coordination-lea-10-2026-10-17/README.md): unit 4/4, real PostgreSQL 10/10, focused desktop/mobile Playwright, production builds and repository architecture/database/document checks passed.
- Package structure validator and documentation checks are recorded with the F00 commit.
- No functional suite or production build was rerun because F00 changes documentation/evidence only.

Human visual acceptance, font portability, native VoiceOver/NVDA, real browser 200% zoom, Coordination retention and TEN-03 remain pending.
