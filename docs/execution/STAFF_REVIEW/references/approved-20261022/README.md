# Administrator Students visual reference

This package is a sanitized, read-only export of the rendered `/admin/students` directory from the local VSchool demo.

## Provenance

- Captured: 2026-10-22 17:29 IST (`2026-10-22T11:59:20Z`)
- Repository branch: `work/stu-01-after-per02-wip`
- Repository HEAD: `f194f3e111ed1812860b0bdf944cc93c8b224a84`
- Executable application source: `223d62332401f972e7407f0dc977e7e990a1446c`
- Served Next.js build ID: `bPsKDL8Z3tqD1DUJBNreD`
- Demo URL used: `http://127.0.0.1:3400/admin/students`
- Health at capture: `ready: true`

The commits after `223d623…` and through HEAD contain Staff evidence/current-state documentation only. They do not change the packaged Students route, shared components, or CSS. The relevant application paths were clean when captured, so the served application source matches the packaged application source for this page.

## Captures

| File | CSS viewport | Full-page bitmap | DPR | Browser zoom |
| --- | ---: | ---: | ---: | --- |
| `screenshots/desktop-1440x1000.png` | 1440 × 1000 | 1440 × 1008 | 1 | 100% Playwright default; no page zoom or device-scale emulation |
| `screenshots/mobile-390x844.png` | 390 × 844 | 390 × 2873 | 1 | 100% Playwright default; no page zoom or device-scale emulation |

Both screenshots use the same authorized synthetic branch and seven-row directory state. One locally created row was not clearly established as fictional. Its display name, initials, admission number, and action accessible label were replaced in the isolated browser DOM with `Sanitized local record` / `REDACTED` before each screenshot. The application and database were not modified. All geometry and remaining content are from the served page.

## Measured geometry

All values are computed CSS pixels from the rendered DOM. The complete computed-style export is in `measurements.json`.

| Region | Desktop 1440×1000 | Mobile 390×844 |
| --- | --- | --- |
| Sidebar | 218 × 1000; visible; navigation viewport 217 × 619 | Hidden at 0 × 0; 44 × 44 menu trigger visible |
| Main/content inset | Main x=218; 38 px left/right internal padding; y=72; 39 px top padding | Main x=0; 16 px left/right internal padding; y=68; 25 px top padding |
| Heading | 113.70 × 36; 28 px / 36 px; weight 650 | 102.34 × 32; 25 px / 32 px; weight 650 |
| Local navigation row | 1146 × 57; 24 px row gap; three 56 px-high tabs | 358 × 111; 10 px row gap; three 44 px-high tabs plus stacked 358 × 44 action |
| Toolbar | 1146 × 40; 8 px gap; 28 px top and 14 px bottom margins | 358 × 94; two stacked 40/46 px rows; 8 px gap; 22 px top and 14 px bottom margins |
| Search composition | 921.59 × 40; select 144 × 38; input 746.59 × 38 | 358 × 46; select 140 × 40; input 187 × 44 |
| Filter / Sort controls | 121.02 × 40 / 87.39 × 40 | 175 × 40 each |
| Table/list region | 1146 × 517 | 358 × 2449 |
| Header row | 1146 × 46 | Visually hidden table header; semantic row remains |
| Data rows | Seven rows, each 1146 × 67 | Seven responsive cards, first 358 × 349 and remaining 358 × 350; 18/16 px vertical/horizontal padding; 15 × 22 px grid gap |
| Action column | 103.16 px column; cells 67 px high; Manage action 95.80 × 32 | Full-width 326 × 67 action cell inside each card; Manage action 95.80 × 32 |

The document had no root horizontal overflow at either viewport. Desktop full-page height was 1008 px; mobile full-page height was 2873 px.

## Included source

`SOURCE_INDEX.md` maps the packaged route, shell, local navigation, directory controls, table primitives, and CSS. Files are copied exactly from the current working tree. No application file was edited for this export.

## Exclusions

The package excludes credential files, tokens, cookies, browser/session state, `.env` files, database content/dumps, build output, Git history, caches, traces, videos, and unrelated evidence. It contains no `private-demo.json` file.

