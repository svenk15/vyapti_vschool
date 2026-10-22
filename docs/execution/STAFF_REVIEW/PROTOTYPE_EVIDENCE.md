# Staff prototype inspection evidence

Prototype source: `prototype/STAFF_WORKFLOWS.html`

Current inspection: 22 October 2026 (Asia/Kolkata); exact UTC timestamp is recorded in `prototype/evidence-operation-recovery/inspection.json`.

The prototype is a self-contained review artifact with fictional in-memory data. It has no authentication, durable persistence or external service. These results verify prototype interaction and presentation only; they are not production application evidence.

## Current browser inspection

- Runtime: repository-installed Playwright Chromium, headless, one worker, device scale factor 1.
- Result: **45 focused checks passed; 30 current viewport captures; zero recorded page errors**.
- Required viewports: 1440×1000, 900×1000, 390×844 and 360×800.
- Themes: Forest, Amethyst, Linen and Porcelain on Directory, Profile and correction drawer at 900×1000.
- Computed body font: `Inter, ui-sans-serif, system-ui, -apple-system, system-ui, Segoe UI, sans-serif`; `document.fonts.check('14px Inter')` returned true and the font set was `loaded`. The prototype embeds `assets/InterVariable.woff2`, copied byte-for-byte from `app/fonts/InterVariable.woff2`, with the repository license in `assets/LICENSE.txt`.
- Every recorded capture reports no root horizontal overflow.

Machine-readable measurements, capture provenance and exact check names are in `prototype/evidence-operation-recovery/inspection.json`.

## Interaction coverage

The focused run exercises:

1. complete-fictional-set Filter and deterministic Sort Apply;
2. Cancel/Escape preserving applied filters/sort and restoring focus;
3. search and Profile → Back state retention;
4. visible fictional save plus one history entry;
5. Personal unknown → edit/attempt Employment → recover Personal → save Employment;
6. Employment unknown → edit/attempt Personal → recover Employment → save Personal;
7. both Save actions disabled during either unknown outcome while both drafts remain editable and survive Close/reopen;
8. original section, target, payload, expected version and key remaining unchanged after the blocked cross-section attempt;
9. exact recovery followed by an independent other-owner save, with one history entry per operation;
10. repeated recovery without a duplicate history entry;
11. stale email and code states with current and attempted facts kept separately;
12. confirmed save plus failed refresh, Close/Escape/reopen, then GET-only refresh recovery;
13. known assignment blocking before mutation;
14. Access outcome unknown preventing the People step;
15. Access confirmed exposing only the still-missing employment step;
16. eligible completion, revoked recovery and no-membership completion with no Access operation;
17. open directory presentation, content-sized Profile side panels, mobile layouts and four-theme geometry.

## Current capture index

All paths are relative to `prototype/evidence-operation-recovery/`.

- Directory/presentation: `directory-open-desktop-1440x1000.png`, `directory-open-intermediate-900x1000.png`, `profile-content-sized-desktop-1440x1000.png`.
- Correction recovery: `correction-personal-pending-cross-save-desktop-1440x1000.png`, `correction-personal-then-employment-desktop-1440x1000.png`, `correction-employment-pending-cross-save-desktop-1440x1000.png`, `correction-employment-then-personal-desktop-1440x1000.png`, `correction-stale-person-desktop-1440x1000.png`, `correction-stale-intermediate-900x1000.png`, `correction-stale-mobile-390x844.png`, `correction-stale-mobile-360x800.png`, `correction-refresh-recovered-desktop-1440x1000.png`.
- Employment ending: `employment-access-unknown-desktop-1440x1000.png`, `employment-access-unknown-mobile-390x844.png`, `employment-assignment-blocked-desktop-1440x1000.png`, `employment-complete-profile-desktop-1440x1000.png`, `employment-no-membership-desktop-1440x1000.png`.
- Theme comparison: `directory-{theme}-900x1000.png`, `profile-{theme}-900x1000.png`, and `correction-{theme}-900x1000.png` for `forest`, `amethyst`, `linen`, and `porcelain`.

The older `prototype/evidence/` and `prototype/evidence-corrected/` directories are historical. They remain for provenance and are not the current acceptance set.

## Direct visual inspection

The current desktop directory, desktop Profile, both cross-section pending/recovered correction directions, stale correction at desktop and 360px, Access-unknown mobile state, and completed Profile were opened and inspected after capture. Both pending captures show the concise guard, editable draft controls and disabled Save actions without changing the accepted drawer composition. The directory uses an open table composition, Profile side panels size to their content, and the responsive comparison layout remains readable. The explicit reviewer-simulation label remains visible.

## Limits

- Native VoiceOver/NVDA and actual 200% browser zoom were not performed.
- The profile, correction, recovery and employment-ending states are proposed design extensions where the approved HTML has no exact complete reference. The reviewer selector labels simulation states explicitly.
- Teaching and Access filtering/sorting remains a production engineering gap until those owners expose versioned full-result projections.
- PD-STF-01, PD-STF-02 and PD-STF-03 remain unapproved. PD-STF-04 remains deferred.
- Human visual acceptance remains PENDING.
