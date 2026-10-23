# Staff Profile action and drawer correction — 23 October 2026

## Candidate and authority

- Application source parent: `6e3977f2d9e4562f9b880005967945c615c7245b` plus the focused files in this checkpoint.
- Served production build: `cnQyWg2vSFtsSsCosagkd` at `http://127.0.0.1:3400`.
- Frozen reference: `docs/execution/STAFF_REVIEW/references/approved-20261022/mock/index.html` (`bbc97d7293e59138c8b7340c8591b66282fb905936be658871109cccfdb5b017`) and `mock/app.js` (`893fbdcf333c77c372e07062864d37152da4315c06fd55c988bf747633f2a81f`).
- Capture environment: Chromium, CSS viewports 1440×1000 and 390×844, device scale factor 1, browser zoom 100%.

## Corrected presentation

- Personal details and Employment now use the frozen Profile's pencil icon and compact `Edit` action.
- Both drawers use the frozen 470px Staff drawer, identity header, field rhythm, footer insets and responsive full-width composition.
- Employment keeps Employee code and Joining date read-only while the existing supported Staff-category correction remains reasoned, versioned and replay-safe.
- Teaching assignments actions use distinct assignment and eligibility icons. They share baseline, height and spacing on desktop, and occupy a separate non-overlapping action row on mobile.

PD-STF-02 remains unapproved. The Personal details drawer therefore presents the frozen composition and truthful values, but disables correction inputs and does not issue a mutation. Employee-code and historical joining-date corrections also remain unavailable. This is an explicit owner-contract deviation from the simulated mock, rather than fake production behavior.

## Evidence

| State | Frozen reference | Current application |
| --- | --- | --- |
| Profile desktop | [reference](reference-profile-desktop.png) | [application](application-profile-desktop.png) |
| Personal drawer desktop | [reference](reference-personal-desktop.png) | [application](application-personal-desktop.png) |
| Employment drawer desktop | [reference](reference-employment-desktop.png) | [application](application-employment-desktop.png) |
| Profile mobile | [reference](reference-profile-mobile.png) | [application](application-profile-mobile.png) |
| Personal drawer mobile | [reference](reference-personal-mobile.png) | [application](application-personal-mobile.png) |
| Employment drawer mobile | [reference](reference-employment-mobile.png) | [application](application-employment-mobile.png) |

`measurements.json` records the two viewports, zero root overflow, and 14×14 rendered icons for both Teaching actions. The screenshots were directly inspected after a clean-cache production build; an initial incremental build omitted the new CSS and was discarded.

## Verification

- Focused Staff Profile browser case passed once against the changed behavior: Personal correction is visibly unavailable; Employee code is read-only; Reason is required; the supported category correction persists after reload (1 passed, 8.0s).
- ESLint for the changed TypeScript/TSX and test files passed.
- `tsc --noEmit` passed.
- Clean `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` passed and produced build `cnQyWg2vSFtsSsCosagkd`.
- Final reference/application capture passed at both viewports with no root overflow.

An earlier command accidentally allowed the Playwright wrapper to begin the broader suite; it was stopped after two unrelated passing cases and is not cited as verification. No backend, authorization, schema, migration, seed or owner command changed. Human visual acceptance remains **PENDING**.
