# Add student and Student Profile visual correction — 22 October 2026

Human visual acceptance is **PENDING**. This evidence covers the bounded Add student typography/control correction and the Student Profile composition only. It does not change an owner contract, route, authorization rule, mutation, schema, migration or seed.

## Provenance

- Base source: `bb0c0477a129ba76cf24c9c36123106e9c30c543` plus the three presentation files named below.
- Production build: `TPu_DCPKN0rL5J51kEi9B`.
- Demo: `http://127.0.0.1:3400`.
- Exact authority: `docs/ux/references/student-onboarding-approved/refined-onboarding.html`, states `#add` and `#student/s1`.
- CSS viewports: 1440×1000 and 390×844; device pixel ratio 1; Playwright visual scale 1.
- Application font: bundled `app/fonts/InterVariable.woff2`, reported loaded by the Font Loading API. The reference requests Inter but embeds no font asset and therefore depends on the host font/fallback.

## Corrected presentation

- Add student uses the reference field rhythm, compact 40px desktop controls, 44px mobile controls, one-pixel borders, six-pixel radii and muted example placeholders.
- **Send a parent portal invitation** is 12px desktop / 13px mobile at 20px line height. Its checkbox is 16×16 with a nine-pixel gap.
- The desktop primary action is 116×36, 13px/550 and six-pixel radius; mobile retains the required 44px target.
- Student Profile uses the reference 884px desktop surface, ten-pixel radius, 15px/600 section headings, compact school facts and Guardian rows, and reference-sized Edit/Add/Manage actions.
- Mobile Profile uses a two-column fact grid and a full-width portal status/action row so real email and status text do not become squeezed.
- The former large Guardian empty illustration is replaced by the reference's compact empty copy.

## Evidence index

| State | Reference | Before | Current application |
|---|---|---|---|
| Add student desktop | `reference-add-desktop.png` | `application-before-add-desktop.png` | `application-after-add-desktop.png` |
| Add student mobile | `reference-add-mobile.png` | `application-before-add-mobile.png` | `application-after-add-mobile.png` |
| Profile desktop | `reference-profile-desktop.png` | `application-before-profile-desktop.png` | `application-after-profile-desktop.png` |
| Profile mobile | `reference-profile-mobile.png` | `application-before-profile-mobile.png` | `application-after-profile-mobile.png` |
| Populated Profile desktop | `reference-profile-populated-desktop.png` | — | `application-profile-populated-desktop.png` |
| Populated Profile mobile | `reference-profile-populated-mobile.png` | — | `application-profile-populated-mobile.png` |

`before-metrics.json` and `after-metrics.json` record the matched reference/application measurements. `final-profile-observations.json` records the final populated capture conditions. `focused-browser-check.json` records current-build geometry, overflow and keyboard checks.

## Verification

- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Focused ESLint for the changed TSX files: passed.
- Production build with the repository's established 4 GiB Node heap: passed; build ID above.
- Focused signed-in Playwright probe: passed sequential desktop/mobile checks for loaded Inter, invitation label/checkbox geometry, action geometry, Profile surface geometry, no root overflow, checkbox/edit focus, Guardian drawer initial focus and Escape focus return.
- The current application and reference captures were inspected directly for hierarchy, typography, spacing, border weight, button shape, populated Guardian composition and mobile portal wrapping.

## Necessary differences

- Forest theme tokens remain authoritative, so literal colors can differ slightly from the reference's static color values.
- Application captures use authorized synthetic records and truthful states rather than the reference's fictional names and statuses.
- **Move section**, Enrollment history and Status management remain because they are supported authorized operations. The static Profile reference does not show those production extensions.
- A pending portal setup shows its real email/status and Review setup action instead of the reference's unconfigured portal state.
