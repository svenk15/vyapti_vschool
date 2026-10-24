# Staff Manage optical icon correction — 24 October 2026

The shared Student/Staff Manage recipe originally forced every glyph into a 20px box. The Staff pencil and shield artwork fills more of its SVG viewBox than the Student glyphs, so it rendered optically oversized even though the computed box matched.

This correction keeps the shared dialog geometry, colors, typography, row spacing, and action-label alignment. Staff glyphs render at 16×16px inside the same 20px allocated leading slot, using 2px inline margins. The action text therefore remains aligned with the Student Manage pattern.

## Rendered measurements

| Property | Desktop | Mobile |
| --- | ---: | ---: |
| Dialog width | 520px | 356px |
| Dialog padding | 28px | 22px |
| Heading/group inset | 29px | 23px |
| Staff glyph inset | 31px | 25px |
| Action-label inset | 61px | 55px |
| Staff glyph size | 16px | 16px |
| Row padding | 13px 12px | 13px 12px |

## Verification

- Focused Playwright, Chromium: 1/1 passed with one worker.
- Focused Playwright, Mobile: 1/1 passed with one worker.
- Focused ESLint and `pnpm exec tsc --noEmit`: passed.
- Production build: passed, build ID `9oK8hoB4lo30pAmpSFWZZ`.
- `chromium-chooser.png` and `mobile-chooser.png` were visually inspected after the correction. Direct Personal, Employment, and portal-access transitions remain captured alongside them.

No API, permission, persistence, fixture, or migration changed. Human visual acceptance remains PENDING.
