# Muted Student form control content — 22 October 2026

## Scope

This bounded presentation correction applies the Forest theme's existing `--vs-text-muted` token to text entered in, selected by and shown as a placeholder in the Administrator **Add student** form and **Add guardian** drawer. Labels, validation messages, focus outlines, buttons and business behavior are unchanged.

- Base application HEAD: `88b673bb133376b58fdb419438d152f74108c23d`
- Verified production build ID: `88erOe5CGCEm8eHcFYacz`
- Demo: `http://127.0.0.1:3400`
- Viewports: 1440×1000 and 390×844 CSS pixels
- Device pixel ratio: 1
- Chromium visual scale: 1

## Rendered evidence

The current build reports `rgb(86, 102, 93)` for `color` and `-webkit-text-fill-color` on populated text inputs and selected dropdown values, and the same color for placeholders. This is the current Forest `--vs-text-muted` value. No root overflow was detected.

- [Add student — desktop](add-student-muted-desktop.png)
- [Add student — mobile](add-student-muted-mobile.png)
- [Add guardian — desktop](add-guardian-muted-desktop.png)
- [Add guardian — mobile](add-guardian-muted-mobile.png)
- [Computed measurements](metrics.json)

The captures were inspected directly. Muted content remains readable; labels retain their stronger hierarchy; selected dropdown values and entered values no longer render as primary body text; focus outlines remain visible; and both responsive compositions remain aligned.

## Verification

- Clean production build: **PASS** (`NODE_OPTIONS=--max-old-space-size=4096 pnpm build`)
- Focused signed-in Chromium rendering probe: **PASS**
- Direct desktop/mobile screenshot inspection: **PASS**
- Database/schema/migration/seed changes: **none**
- Backend, authorization, identity, idempotency and recovery changes: **none**

Human visual acceptance remains **PENDING**.
