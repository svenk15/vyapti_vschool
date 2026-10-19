# UX-11 Coordination directory evidence

Date: 19 October 2026 (Asia/Kolkata)

## Scope and provenance

- Base application source: `057e455`.
- Verification source: the focused commit containing this record; application code is unchanged from `057e455`.
- Standard application build ID: `JZi2cbc7qsZGc_ob70Zo8`.
- Administrator worker route: `/admin/coordination`.
- Principal queue route: `/leadership/coordination`.
- Reference relationship: design extension. The approved pack defines Coordination journeys and shared directory/detail patterns, but it has no exact Administrator or Principal production queue screen. These captures are therefore a direct shared-pattern review, not an exact visual match claim.
- Data: fictional isolated Playwright fixtures for the populated and lifecycle states; the existing fictional People demo branch for the genuine empty Administrator state. No grant was broadened for presentation evidence.

## Direct inspection

The Administrator route presents only work currently assigned to the signed-in worker. Its genuine empty state uses one bounded surface, meaningful document icon and concise guidance. The Principal queue presents exact authorized source, owner/due, status and one row action in a compact semantic table; at 390×844 each row becomes a labelled card without horizontal clipping. Detail states keep source facts, append-only history and guarded actions visually separate.

The populated desktop/mobile queue, awaiting-verification detail and resolved setup-review detail were inspected directly. Hierarchy, Inter typography, table/card density, status treatment, action placement and mobile stacking are consistent with the accepted portal recipes. The seeded Administrator empty state reports zero root overflow at both viewports. The desktop sidebar remains independently scrollable above its fixed account footer; the focused mobile journey opens the Principal menu as a modal dialog, exposes the current `Follow-ups` destination, closes with Escape and restores focus to the menu trigger.

No application presentation defect was found in this slice. The only correction was an obsolete browser assertion that expected the closed desktop `complementary` role and former `Operational follow-ups` label after opening the mobile drawer. The assertion now matches the existing accessible mobile dialog and current navigation label; authorization and product behavior are unchanged.

## Files

- `application-desktop.png`, `application-mobile.png`: genuine empty Administrator worker state at 1440×1000 and 390×844.
- `application-populated-desktop.png`, `application-populated-mobile.png`: populated Principal queue at the same viewports.
- `application-review-desktop.png`, `application-review-mobile.png`: exact missing-register request awaiting independent verification.
- `application-resolved-desktop.png`, `application-resolved-mobile.png`: independently verified session-setup review with immutable history.
- `metrics-desktop.json`, `metrics-mobile.json`: viewport, DPR, computed font, overflow and title observations for the Administrator route.

## Verification

- Focused Chromium journey — passed 1/1 against `vyapti_vschool_test`; current source, 118 migrations, one worker. This result was produced before the assertion-only repair and covers the unchanged full business journey.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm test:e2e test/e2e/coordination.spec.ts --project=mobile --workers=1 --grep 'completes missing-register and setup-review follow-ups'` — passed 1/1 against `vyapti_vschool_test`; 118 migrations applied, none pending. It covered creation, stale recovery, capability revocation/restoration, independent return and closure, Attendance-owned cancellation evidence, responsive layout, root overflow and mobile menu focus restoration.
- Focused lint and documentation validation are recorded by the checkpoint commit.
- No application build was repeated because application code did not change after the already-passing standard build `JZi2cbc7qsZGc_ob70Zo8`.

Human visual acceptance, native VoiceOver/NVDA, actual-browser 200% zoom, TEN-03 and production release remain pending.
