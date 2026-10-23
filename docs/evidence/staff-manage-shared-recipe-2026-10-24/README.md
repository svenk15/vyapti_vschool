# Shared Student and Staff Manage recipe — 24 October 2026

The earlier Staff correction reused Student class names but retained Staff-specific selectors in the cascade. That left room for the group label, icons, and content insets to drift. This follow-up removes that ambiguity: Student and Staff now consume one neutral `record-manage` presentation recipe.

## Shared computed contract

At the Forest-theme comparison state:

| Property | Desktop | Mobile |
| --- | ---: | ---: |
| Dialog width | 520px | 356px rendered border box |
| Dialog padding | 28px | 22px |
| Heading inset from outer edge | 29px | 23px |
| Group-label text inset | 29px | 23px |
| Leading icon inset | 29px | 23px |
| Action-label inset | 61px | 55px |
| Action padding | 13px 12px | 13px 12px |
| Icon size | 20px | 20px |
| Group-label color | `rgb(86, 102, 93)` | same token |
| Icon color/stroke | `rgb(36, 107, 83)` | same token |

The values are asserted against the rendered Staff dialog. The Student and Staff components both use `record-manage-links`, `record-manage-group`, and `record-manage-link`; no Staff selector can override this recipe. Staff-specific operations and permission checks remain unchanged.

## Evidence and verification

- Current Staff: `chromium-chooser.png`, `mobile-chooser.png`
- Direct transitions: `chromium-personal.png`, `chromium-employment.png`, `chromium-access.png` and mobile equivalents
- Student comparison inspected: `docs/evidence/ux-revamp-06-2026-10-18/application-students-manage-desktop.png` and mobile equivalent
- Focused Playwright: Chromium 1/1 and Mobile 1/1 passed with one worker.
- Focused ESLint and `pnpm exec tsc --noEmit`: passed.
- Production build: passed with build ID `vQNoJKNBFJcKKstPb8CqR`.

No API, permission, persistence, seed, or migration changed. Human visual acceptance remains PENDING.
