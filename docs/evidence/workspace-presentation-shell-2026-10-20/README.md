# Five-workspace shared shell evidence — 20 October 2026

## Provenance

- Candidate base HEAD: `6da37fe918ada989f9140f4e1e503771bf4ce432`.
- Executable production build ID: `8Og_vUH3xC_eOFXGFel7t`.
- Demo origin: `http://127.0.0.1:3400`.
- Data: existing fictional development fixtures; credentials and tokens are excluded.
- Browser: local Playwright Chromium, device pixel ratio 1, CSS viewports recorded in `metrics.json`.

## Directly inspected states

Each authenticated landing page and open navigation was captured at:

- `desktop`: 1440×1000.
- `short-desktop`: 1280×800.
- `intermediate`: 900×900.
- `mobile`: 390×844.
- `narrow-mobile`: 360×800.

The 25 images are named `<workspace>-<viewport>.png` for `administrator`, `teacher`, `student`, `parent` and `principal`. Inspection confirmed the canonical shell is used by all five roles; account/sign-out stays fixed while long navigation scrolls; no captured page has root horizontal overflow; and Parent/Student content remains visible behind the separate bottom-navigation reservation.

## Computed contract evidence

`metrics.json` records, for every capture:

- 240px desktop sidebar and 320px drawer at the tested mobile/intermediate widths.
- 16px navigation horizontal padding.
- 4px navigation/group gap, with explicit 8px major-section margins in source.
- 44px first interactive row, 12px row padding, 8px radius and 12px icon/label gap.
- 20px icon geometry and Inter Variable as the actual platform font.
- visible fixed footer and independent navigation `clientHeight`/`scrollHeight`.
- no document-root horizontal overflow.

At 1280×800, Teacher, Student and Parent navigation exceeds the available navigation region while the footer remains visible, directly demonstrating the independent scroll region rather than pushing account controls out of the viewport.

## Interaction verification

- Administrator navigation Playwright: active direct route, collapsed/expanded groups, simultaneous expansion, nested active route, mobile close and Escape focus return.
- Parent and Student Playwright: authorized role entry, context-safe route navigation, mobile More drawer, Escape focus return and bottom-navigation behavior.
- Principal Playwright: protected entry, branch switch, mobile drawer and Escape focus return.
- Teacher/Attendance Playwright: protected Teacher entry and current shared shell consumer.

The visual inspection is limited to the shared shell and five populated landing compositions. Page-level compositions retain their existing evidence and are tracked separately in `docs/execution/WORKSPACE_PRESENTATION_REVAMP/PAGE_COVERAGE.md`. Human acceptance remains pending.
