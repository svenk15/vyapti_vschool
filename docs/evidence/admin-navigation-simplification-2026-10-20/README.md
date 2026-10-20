# Administrator navigation simplification preview evidence

Prepared and refined 20 October 2026 (Asia/Kolkata). The original proposal checkpoint is `546b436dd88b9f848a62ee4480b4f627c9d7d83a`; this refinement uses the user-selected **Concept 1 — Quiet workspace** as desktop presentation authority. It changes no production application file, route, permission, database state or workflow. Human review of the refined preview and its proposed mobile adaptation is **PENDING**.

## Deliverables

- [Current-to-proposed map and implementation-ready specification](../../execution/UX_REVAMP/ADMIN_NAVIGATION_SIMPLIFICATION.md)
- [Interactive preview](../../ux/references/admin-navigation-simplification/NAVIGATION_PREVIEW.html)
- [Preview README](../../ux/references/admin-navigation-simplification/README.md)
- [Selected Concept 1 reference capture](reference-concept-1.png) and [exact SVG source](../../ux/references/student-concepts/concept-1.svg)
- [Previous preview before refinement](preview-before-desktop-1440x1000.png)
- Current production navigation evidence reused because no navigation source changed: [desktop](../uxr-00-02-2026-10-20/administrator-navigation-desktop.png), [mobile](../uxr-00-02-2026-10-20/administrator-navigation-mobile.png)

## Directly inspected comparison evidence

| State | Evidence |
|---|---|
| Selected reference | [Concept 1, 1440×920](reference-concept-1.png) |
| Refined Students Directory | [1440×920](quiet-students-desktop.png), [900×900](quiet-students-intermediate.png) |
| Proposed mobile adaptation | [390×844](quiet-students-mobile.png), [360×800](quiet-students-narrow.png) |
| Mobile navigation open and independently scrolled | [390×844](quiet-students-mobile-drawer.png), [360×800](quiet-students-narrow-drawer.png) |
| Students destinations | [Admissions](quiet-students-admissions-desktop.png), [Imports](quiet-students-imports-desktop.png) |
| Separate Staff pattern | [Profiles / Access / Availability](quiet-staff-desktop.png) |
| Keyboard focus | [secondary navigation focus](quiet-students-keyboard-focus-desktop.png) |
| Restricted states | [no registration](quiet-restricted-noRegistration-desktop.png), [Directory only](quiet-restricted-directoryOnly-desktop.png), [Imports only](quiet-restricted-importsOnly-desktop.png), [no Students](quiet-restricted-noStudents-desktop.png), [no Timetable](quiet-restricted-noTimetable-desktop.png), [Attendance only](quiet-restricted-attendance-desktop.png) |

The reference and final captures were visually inspected side by side. The refined desktop preview reproduces the 218px pale sidebar, 72px header, 38px workspace inset, open white directory, compact link row, short Forest indicator, right-aligned contextual action, 40px toolbar, restrained 67px rows and 36px compact action. It removes the old design note, subtitle and directory registration form. Students, Admissions, Imports and the Staff example keep distinct destinations and actions.

Necessary differences are explicit: the broad simulated profile retains currently authorized conditional School services; Inter 4.1 is loaded from the repository instead of the SVG's Arial authoring label; records are fictional; the mobile/card layout is a proposed extension because the selected reference defines desktop only. The review-settings disclosure is excluded from comparison captures and is not product UI.

## Verification

`node docs/evidence/admin-navigation-simplification-2026-10-20/verify-preview.cjs` passed with one Chromium process and sequential contexts. It verified:

- direct Students, Admissions, Imports, registration and Staff navigation;
- exactly one matching primary and secondary current state, URL-backed history restoration and the registration return path;
- 1440×920, 900×900, 390×844 and 360×800 without document overflow;
- 218px desktop sidebar, 38px content inset, 36px desktop action, 40px desktop search and 44px mobile action/link targets;
- the bundled Inter asset loaded successfully;
- mobile drawer opening, own-region service reachability, zero horizontal document scroll, Tab containment, Escape and focus return;
- no-registration, single Directory, independent Imports, omitted Students, no-Timetable fallback and Attendance-only simulations;
- Forest, Sunrise, Indigo and Slate token application without root overflow.

Raw computed results: [preview-verification.json](preview-verification.json). Actual browser zoom, VoiceOver and NVDA were not exercised and are not reported as passed.

`pnpm check:docs` was run once after the records were updated. It remains non-green only for the same two pre-existing unrelated links in `docs/execution/WORKSPACE_PRESENTATION_REVAMP/CURRENT_STATE.md` and `PAGE_COVERAGE.md` to the absent `../../evidence/workspace-presentation-route-pass-2026-10-20/README.md`; this checkpoint introduced no new reported link failure. Targeted `git diff --check` passed. The working tree's unrelated historical screenshot changes were preserved.

## Scope status

- Concept 1 desktop direction selection: **RECORDED**.
- Refined isolated preview: **ENGINEERING VERIFIED / DIRECTLY INSPECTED**.
- Proposed mobile adaptation: **HUMAN REVIEW PENDING**.
- Production navigation implementation: **NOT STARTED by instruction**.
- Accepted Student registration production composition: remains scoped to executable commit `6c4f64a49396c772064049b58fb3bb00f53f23b6` and was not modified.
- TEN-03, native accessibility and production release: **PENDING**.
