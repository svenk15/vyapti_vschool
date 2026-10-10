# Reproducible visual and interaction acceptance

## Environment

Use the same browser/version, OS, deviceScaleFactor, viewport, browser zoom, color scheme and loaded fonts for reference and application. Baseline fixture sizes in this edition: 1440×1000 desktop, 390×844 narrow layout, deviceScaleFactor 1, light color scheme, reduced motion, en-GB locale, Asia/Kolkata. The narrow fixture is viewport layout evidence, not a physical touch-device certification. Also test relevant coarse-pointer targets and intermediate 800/1100 breakpoints when implementing shared components.

Reference-only capture command, from a repository with Playwright available:

```sh
node <design-pack>/implementation-spec/tools/capture-reference.cjs
```

Optional PLAYWRIGHT_MODULE, CHROMIUM_EXECUTABLE and CHROMIUM_ARGS support an existing harness. No dependency install or real application access is performed by the script. Use trusted arguments. The script writes reference measurements/screenshots; never run it as an automatic approval/update action. Review changes before replacing any accepted baseline.

## Source contract versus observed geometry

Source CSS is in CSS pixels. Screenshot bitmap dimensions and scaled Mac captures are not CSS measurements. The reference has a prototype review bar; exclude that chrome or compare aligned component/content regions. Do not offset production layout to compensate for the absent review banner.

measurements.json records actual element styles/rectangles, text and visible controls. Treat reference rect coordinates as observations of one fixture, not hardcoded layout rules. CSS flex/grid/content rules remain authoritative for other sizes. Extracted style indexes do not flatten nested media/cascade; read the ordered stylesheets for exact behavior.

## Visual check

1. Render reference and production with comparable synthetic content, same context and state. Wait for fonts/images and data; disable incidental animations.
2. Capture directory, open drawers/dialogs, wizard steps and applicable failure/empty states.
3. Compare component structure, tokens, measured geometry and visible images. A suggested engineering triage bound is 1 CSS pixel for measured static component edges under identical fixtures; this is not permission to accept wrong typography, hierarchy or controls, and is not a universal screenshot threshold.
4. Use pixel diffs as an aid. Allow only justified anti-aliasing noise or explicitly masked truly dynamic content. Never mask missing controls, text layout, table columns or the component being assessed. Do not loosen thresholds or update baselines to make unexplained differences pass.
5. For responsive behavior check reflow, clipping, scroll containment, focus, pointer target sizes and 200% native browser zoom separately. Narrow viewport screenshots do not prove zoom or screen-reader conformance.

## Interaction check

Verify search Enter, attribute matching, URL state, sort/filter draft versus applied state, Cancel/Escape, focus return, tab order, form labels/errors, stale-write handling and command retry semantics as applicable. Real database and authorization tests remain separate evidence. Do not turn prototype review scenario switches into product UI.

## Completion record

Each task records source hash/reference state, production commit/build, fixture/browser/fonts, checks executed, comparison assets, known differences, functional state, visual state, human review and release gates. Extracted measurements are not production verification. Never declare all states tested when only entry screens were captured.

## Unresolved details register

- Administrator body font: no pinned embedded font; actual Mac rendering must be established or a new portable font baseline explicitly approved.
- Source fixed drawer-body calculation: port to robust flex layout while preserving measured appearance; verify footer at zoom/mobile.
- Source input placeholder focus suppression: retain visible keyboard focus in production; document this accessibility correction.
- Specialized views: generic catalog may be superseded by Families/Communication/Timetable implementations; inspect actual route before coding.
- Prototype partial validation, in-memory drafts and fictional authorities: not production business contracts. Missing retention/maxima/verification/approval rules require owner design, not visual inference.
- All other workspaces: CSS/tokens/assets extracted; full per-screen measured/state contracts are not claimed in this revision.
