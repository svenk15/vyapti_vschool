# UX-11 Attendance request queues

Date: 19 October 2026 (Asia/Kolkata)

## Scope

- `/admin/attendance/correction-requests`: explicitly assigned exact-source correction requests.
- `/admin/attendance/explanations`: Parent absence explanations visible to the currently authorized reviewer.
- Candidate source: focused commit containing this record, based on `2d3b0c2`.
- Production build ID: `6JiNwD4KtOD7F-bt8fQlx`.
- Schema/migrations: unchanged; development and test retain 118 applied migrations.

The approved Administrator pack provides the Attendance module tabs and the SA-29 explanation review workflow, but no exact production queue composition for either route. These queue pages are therefore shared inbox/directory recipe extensions, not exact reference matches. The existing SA-29 detail/review composition and Attendance correction command boundaries are unchanged.

## Changes

- Absence explanations now sit inside the shared Attendance module hierarchy with Sessions, Attendance reports and Absence explanations tabs.
- Both queues use one bounded card, a truthful count, semantic server-authorized rows, and one clear action per row.
- Explanation categories use school-office labels instead of raw enum formatting; class and subject remain distinct within one cell.
- Mobile tables become labelled cards so the category and review action remain visible. The final visual pass moved responsive tab overrides after desktop rules; the complete active tab now wraps rather than clipping at 390px.
- The correction queue's empty state remains truthful for the seeded Administrator; no grant or request was fabricated for screenshots.

## Captures

| Capture | State |
|---|---|
| `correction-requests-before-desktop.png` / `correction-requests-before-mobile.png` | Previous unbounded empty queue |
| `correction-requests-after-desktop.png` / `correction-requests-after-mobile.png` | Corrected bounded empty queue |
| `explanations-before-desktop.png` / `explanations-before-mobile.png` | Previous table; mobile hid content and actions horizontally |
| `explanations-after-desktop.png` / `explanations-after-mobile.png` | Corrected semantic directory and labelled mobile cards |

All captures use the same authorized synthetic Administrator and the effective Forest theme at 1440×1000 or 390×844 CSS viewports. Final screenshots were directly inspected for hierarchy, row density, field separation, tab reachability, action visibility and root overflow.

## Verification

- TypeScript and focused ESLint: PASS.
- `pnpm test:e2e test/e2e/principal-attendance-correction-request.spec.ts --project=chromium --workers=1`: PASS (1/1).
- Same correction-request journey with `--project=mobile`: PASS (1/1).
- `pnpm test:e2e test/e2e/principal-attendance-explanation.spec.ts --project=chromium --workers=1`: PASS (1/1).
- Same explanation journey with `--project=mobile`: PASS (1/1).
- These journeys used the guarded real PostgreSQL test database with all 118 migrations and retained exact reviewer, source-revision, owner-command and non-mutating-explanation checks.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`: PASS after the final responsive cascade correction; build ID `6JiNwD4KtOD7F-bt8fQlx`.

Human visual acceptance, native VoiceOver/NVDA, actual browser 200% zoom, TEN-03 and production release remain PENDING.
