# Staff prototype inspection evidence

Prototype source: `prototype/STAFF_WORKFLOWS.html`

Corrected inspection time: 22 October 2026, 02:25 IST (`2026-10-21T20:55:25.404Z`)

The prototype is a self-contained local review artifact with fictional in-memory data. It has no authentication, persistence or external service. These results verify the artifact’s interaction and presentation only; they are not production application evidence.

## Browser inspection

- Runtime: repository-installed Playwright Chromium, headless, device scale factor 1.
- Captures: 22 current corrected captures.
- Required widths inspected: 1440×1000, 900×1000 and 390×844.
- Themes: Forest, Amethyst, Linen and Porcelain on Directory, Profile and correction drawer at 900×1000.
- Computed body font: `Inter, ui-sans-serif, system-ui, -apple-system, system-ui, Segoe UI, sans-serif`; `document.fonts.check()` returned true and the font set was `loaded`. The prototype embeds `assets/InterVariable.woff2`, copied byte-for-byte from `app/fonts/InterVariable.woff2`, with the repository license in `assets/LICENSE.txt`.
- Root overflow: none reachable in the final captures. The 900px directory switches to labelled Staff cards; wide table content is not clipped.
- Console/page errors: none.

## Focused interaction checks

All 29 focused checks passed. Coverage includes: Filter Apply over the complete fictional set; Sort Apply and deterministic order; Cancel/Escape retaining applied filters and sort; Escape focus return; Enter search; Profile → Back query retention; committed edits reflected in both the visible profile and history while unsaved Employee entries remain; distinct rejected, stale, unknown and saved-but-refresh-failed states; original-outcome recovery; all five employment-ending states; mobile menu Escape and focus return.

Machine-readable measurements and the exact check names are in `prototype/evidence-corrected/inspection.json`.

## Capture index

- Desktop interactions: `directory-filtered-desktop-1440x1000.png`, `directory-sorted-desktop-1440x1000.png`, `profile-saved-history-desktop-1440x1000.png`, and `correction-{rejected,stale,unknown,refresh-failed}-desktop-1440x1000.png`.
- Mobile interactions: `directory-mobile-390x844.png`, `correction-refresh-failed-mobile-390x844.png`, and `employment-unknown-mobile-390x844.png`.
- Theme comparison: `directory-{theme}-900x1000.png`, `profile-{theme}-900x1000.png`, `correction-{theme}-900x1000.png` for `forest`, `amethyst`, `linen`, and `porcelain`.

All paths above are relative to `prototype/evidence-corrected/`. The earlier `prototype/evidence/` directory is retained as historical evidence and is not the corrected acceptance set.

## Visual findings resolved during inspection

- Applied query state and drawer draft state are now separate; Cancel and Escape cannot silently apply draft values.
- Search, filters and sort survive Profile → Back.
- Fictional saves now update the record and history; the corrected Profile is re-rendered before recovery content is shown.
- Failure simulations now render distinct page/drawer states with appropriate actions instead of a generic success message.
- Mobile navigation and dialogs return focus to stable openers.

## Limits

- Native VoiceOver/NVDA and actual 200% browser zoom were not performed for this documentation prototype.
- The profile, correction, recovery and employment-impact states are proposed production extensions where the approved HTML has no exact complete reference. The scenario selector labels them as reviewer simulations.
- Teaching and Access filtering/sorting remains a production engineering gap until those owners expose versioned full-result projections. The prototype deliberately demonstrates the proposed experience only.
- Human visual acceptance remains PENDING.
