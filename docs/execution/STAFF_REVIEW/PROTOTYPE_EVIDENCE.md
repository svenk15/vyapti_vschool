# Staff prototype inspection evidence

Prototype source: `prototype/STAFF_WORKFLOWS.html`

Inspection time: 22 October 2026, 02:05 IST (`2026-10-21T20:35:43.856Z`)

The prototype is a self-contained local review artifact with fictional in-memory data. It has no authentication, persistence or external service. These results verify the artifact’s interaction and presentation only; they are not production application evidence.

## Browser inspection

- Runtime: repository-installed Playwright Chromium, headless, device scale factor 1.
- Captures: 19.
- Required widths inspected: 1440×1000, 900×1000, 390×844 and 360×800.
- Themes: Forest, Amethyst, Linen and Porcelain on Directory, Profile and correction drawer at 900×1000.
- Computed body font: `Inter, ui-sans-serif, system-ui, -apple-system, system-ui, Segoe UI, sans-serif`. The standalone file does not embed a font file; the actual resolved face therefore depends on the review machine. Production must continue to use the repository-approved font assets/stack.
- Root overflow: none reachable in the final captures. The 900px directory switches to labelled Staff cards; wide table content is not clipped.
- Console/page errors: none.

## Focused interaction checks

All passed:

1. Enter applies directory search.
2. Filter drawer Escape closes it and returns focus to Filters.
3. Profile opens and Back returns to the Staff directory.
4. Add validation retains the page and explains missing fields.
5. Unknown create retains the original intent and offers status recovery.
6. Saving the Person correction retains safe unsaved values in the Employee section.
7. Correction drawer Escape returns focus to Correct details.
8. Mobile navigation opens, closes and returns focus to the menu trigger.

Machine-readable measurements and results are in `prototype/evidence/inspection.json`.

## Capture index

- Exact prototype sizes: `directory-forest-1440x1000.png`, `directory-forest-390x844.png`, `profile-forest-1440x1000.png`, `profile-forest-390x844.png`, `correction-drawer-360x800.png`, `add-existing-900x1000.png`, `access-expired-390x844.png`.
- Theme comparison: `directory-{theme}-900x1000.png`, `profile-{theme}-900x1000.png`, `correction-{theme}-900x1000.png` for `forest`, `amethyst`, `linen`, and `porcelain`.

## Visual findings resolved during inspection

- Intermediate-width table composition initially created reachable root horizontal scrolling. At 900px it now uses the labelled responsive card layout.
- The first mobile shell had no visible close control. The final drawer includes a 44px close target and returns focus to the opener.
- Mobile menu icon and fixed overlay positioning were corrected before the final capture.

## Limits

- Native VoiceOver/NVDA and actual 200% browser zoom were not performed for this documentation prototype.
- The profile, correction, recovery and employment-impact states are proposed production extensions where the approved HTML has no exact complete reference.
- Human visual acceptance remains PENDING.
