# Five-workspace landing current-source regression

Date: 19 October 2026 (Asia/Kolkata)

Executable application source: `04a3dac718a885861c4b1ff378593286e45fbc18`

Production build: `FnDUkbvFIP6IQWBb04_Ju`

Demo: `http://127.0.0.1:3400`

Human visual acceptance: **PENDING**

This checkpoint rechecks the completed five-workspace landing correction after later shared Administrator navigation and CSS work. It does not reopen the landing design or change business behavior.

## Finding-by-finding result

| Requested finding | Current result | Evidence or boundary |
|---|---|---|
| Compact Parent and Student mobile summaries | Fixed and retained | Current production pages render four compact label/value rows at both 390×844 and 360×800 CSS pixels, DPR 1, with no document overflow. The 360 px summary heights remain below 300 px. |
| Teacher content priority | Fixed and retained | Current order is active register, registers to finish, today's classes, then teaching work. Calendar and quick access remain secondary. No permanent submitted-register help panel is present. |
| Principal operational language | Fixed and retained | No banned implementation phrases appear. Decisions and active follow-ups are distinct labelled populations. |
| Principal currency and count semantics | Fixed and retained | The Finance decision displays `₹250.00`. Exact and bounded values remain internally consistent within each population. |
| Parent notices | Fixed and retained | The existing explicitly authorized Parent context shows three real synthetic notice rows. No grant was added for this evidence run. |
| Principal follow-up meaning | Fixed and retained | The page labels OPEN/IN_PROGRESS Coordination items as active, not due. |
| Communication reach | Fixed and retained | The latest notice shows read and acknowledgement facts; publication count is not presented as reach. |
| Role-specific reference gallery | Already resolved | `/design-system#landing-references` uses each workspace's production section order and labels fixtures synthetic. No Administrator/Principal section substitution was introduced by later work. |
| Calendar date/range/state behavior | Already resolved; unchanged source reused | The calendar model, shared calendar component and focused tests are unchanged since `e00d23e`. Existing evidence covers branch-local dates, inclusive ranges, published/cancelled/unavailable states, selection and disabled out-of-range controls. |
| Calendar failure recovery | Verification gap retained | The UI exposes a retry of the same authorized route and its failed state was browser checked. A real transient owner failure followed by recovery still lacks a safe fault injector. |
| Navigation regression | Current-source pass | The shared verifier checked current protected destinations, Inter, 44 px minimum desktop rows, independently scrolling navigation, visible account context/footer, separate sign-out, mobile focus containment, Escape dismissal/focus return and server-authorized route probes. |

## Current-source screenshots

The five production landing pages were captured from the same executable build at 1440×1000 and 390×844 CSS pixels:

- `administrator-desktop.png`, `administrator-mobile.png`
- `teacher-desktop.png`, `teacher-mobile.png`
- `parent-desktop.png`, `parent-mobile.png`
- `student-desktop.png`, `student-mobile.png`
- `principal-desktop.png`, `principal-mobile.png`

The required narrow checks are `parent-mobile-360.png` and `student-mobile-360.png`. Expanded desktop and mobile navigation captures are stored beside the landing captures. Sanitized measured results are in `persona-verification.json` and `mobile-360-verification.json`.

The earlier candidate's before images and the corrected implementation images remain in [`../ux-revamp-landing-closure-2026-10-19`](../ux-revamp-landing-closure-2026-10-19/README.md). Those images are the direct before/after record for the specific landing corrections; this directory establishes that later shared presentation changes preserved the result.

## Direct visual inspection

All ten current desktop/mobile captures and both 360 px captures were opened and inspected. The review checked hierarchy, summary density, section order, readable labels, action placement, sidebar/footer reachability, fixed mobile navigation, text wrapping and root overflow. The fixed mobile utility bar overlaps content only while the viewport is in motion; page bottom padding keeps final controls reachable.

## Verification provenance

| Check | Result | Provenance |
|---|---|---|
| Current-source persona/browser verifier | PASS, 11/11 | Existing repository verifier, one Chromium instance, sequential 1440×1000 and 390×844 viewports, build `FnDUkbvFIP6IQWBb04_Ju`. |
| Current-source 360 px Parent/Student check | PASS, 2/2 | Sequential Chromium contexts; four summary rows, height below 300 px, DPR 1, Inter computed font and no root overflow. |
| Direct screenshot inspection | COMPLETE | All current-source captures in this directory were inspected rather than inferred from assertions. |
| Calendar model unit tests | REUSED, 3/3 | Source and focused test are unchanged since the verified `e00d23e` landing checkpoint. |
| Finance PostgreSQL test | REUSED, focused 1/1 | Finance projection and landing adapter are unchanged since the verified landing checkpoint. |
| Production build | REUSED CURRENT EXECUTABLE | Later Administrator work produced build `FnDUkbvFIP6IQWBb04_Ju`; this exact build was served for the browser checks. No build was repeated for this evidence-only pass. |

## Remaining boundaries

- Teacher and Principal Events-reader authority remains unresolved; their truthful unavailable states are retained.
- A real transient calendar failure/recovery needs a safe owner fault-injection contract.
- Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain pending.
- No schema, migration, grant, route, fixture or product source changed in this current-source regression.
