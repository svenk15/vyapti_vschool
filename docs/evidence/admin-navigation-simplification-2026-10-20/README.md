# Administrator navigation simplification proposal evidence

Prepared 20 October 2026 (Asia/Kolkata) from production source `f272989b9b3d6acba4f84d98e00c45fb240146a3`. This checkpoint changes no production application file, route, permission, database state or workflow. Human review is **PENDING**.

## Deliverables

- [Current-to-proposed map and implementation plan](../../execution/UX_REVAMP/ADMIN_NAVIGATION_SIMPLIFICATION.md)
- [Interactive preview](../../ux/references/admin-navigation-simplification/NAVIGATION_PREVIEW.html)
- [Preview README](../../ux/references/admin-navigation-simplification/README.md)
- Current production navigation evidence reused because no navigation source changed: [desktop](../uxr-00-02-2026-10-20/administrator-navigation-desktop.png), [mobile](../uxr-00-02-2026-10-20/administrator-navigation-mobile.png)

## Preview evidence

| State | Evidence |
|---|---|
| Broad desktop, Students active | [1440×1000](preview-desktop.png) |
| Intermediate layout | [900×900](preview-intermediate.png) |
| Mobile drawer | [390×844](preview-mobile-drawer.png), [scrolled services](preview-mobile-drawer-lower.png) |
| Narrow mobile drawer | [360×800](preview-narrow-drawer.png), [scrolled services](preview-narrow-drawer-lower.png) |
| Academics without Timetable simulation | [desktop](preview-academics-fallback-desktop.png) |

The screenshots were directly inspected. The preview uses fictional content, calls no owner API and performs no mutation. Only the broad source catalogue is based on the current seeded Administrator; the restricted profile selector is explicitly simulated from current route visibility contracts.

## Verification

`node docs/evidence/admin-navigation-simplification-2026-10-20/verify-preview.cjs` passed with one Chromium instance and sequential contexts. It verified:

- the exact six broad primary labels and active Students state;
- 1440×1000, 900×900, 390×844 and 360×800 with no root overflow;
- 232px desktop, 210px intermediate and 260px mobile sidebar widths;
- accepted registration card widths of 740px desktop, 354px mobile and 324px narrow;
- Attendance-only navigation simulation;
- Academics fallback with no Timetable tab or timetable sample content;
- conditional-service scroll reachability above the account footer;
- mobile Tab wrapping, Escape closure and focus restoration.

Raw computed results: [preview-verification.json](preview-verification.json). Actual browser zoom, VoiceOver and NVDA were not tested and are not reported as passed.

`pnpm check:docs` was run once. It remains non-green only for the same two pre-existing links in unrelated dirty `WORKSPACE_PRESENTATION_REVAMP` documents to the absent `workspace-presentation-route-pass-2026-10-20/README.md`; no new link failure was reported for this checkpoint.

## Scope status

- Registration composition visual acceptance: **PASSED**, scoped to executable commit `6c4f64a49396c772064049b58fb3bb00f53f23b6`.
- Navigation proposal engineering inspection: **COMPLETE**.
- Production navigation implementation: **NOT STARTED by instruction**.
- Navigation human acceptance: **PENDING**.
- TEN-03 and production release: **PENDING**.
