# Administrator Attendance UX correction — AC-01–AC-08

## Provenance

- Frozen baseline: `792dd691e9e95f6f52113dc4e970d21cb5ccdb71`, build `XVWEjCcC5xkrftgU8lkmb`.
- Corrected application: `49c2542161478522d895d1ee7357016adb10d49b`.
- Verified production build: `RscvfUEa7EzLAioXBK7Dx`.
- Demo: `http://127.0.0.1:3400` (synthetic local data; credentials remain in ignored `artifacts/people-02/private-demo.json`).
- Reference: unchanged `reference-source/approved-c.html` from `artifacts/vschool_attendance_acceptance_792dd691.zip`; SHA-256 is recorded in the handoff manifest.
- Capture environment: Chromium, device scale factor 1, `Asia/Kolkata`; 1440×1000, 900×1000, 390×844 and 360×800 CSS viewports.
- Comparison data: [measurements.json](measurements.json), [extended-measurements.json](extended-measurements.json), [theme-measurements.json](theme-measurements.json), and [comparison-overlays.html](comparison-overlays.html).

Functional verification, direct visual comparison, human acceptance and production readiness are separate. Human acceptance remains **PENDING**.

## Correction matrix

| ID | Finding | Correction | Verification | Direct comparison | Status |
|---|---|---|---|---|---|
| AC-01 | Mobile header, date controls, local tabs and contextual actions used stacked or clipped layouts. | Added a compact two-column local task bar, reference ordering, a mobile “Schedule” presentation with the full accessible label, a narrow Reports export row, and full-width search/Filter/Sort rows. | Final desktop/mobile connected journey; four viewport captures and bilateral measurements. | `reference/application-{registers,reports}-{desktop,compact,mobile,narrow}.png` | PASS |
| AC-02 | Registers, Requests and roster records fell back to tall generic label/value cards. | Added scoped compact record compositions while retaining production Teacher and admission identifiers. | Connected Attendance and correction-request journeys; responsive captures. | Register and Request pairs at all four viewports; register-detail pairs include the roster. | PASS |
| AC-03 | Mobile drawers could appear below scrolled page content and expose the background. | Scoped Attendance drawers to the right viewport edge on desktop and the full dynamic viewport on mobile; body scroll and sticky footer remain internal. | Measured `x/y/width/height` for Filters, Sort, Schedule, Correction, Cancellation, Request review, Missing registers and History. Escape/focus restoration is exercised by connected journeys. | Drawer pairs at all four viewports; application mobile/narrow bounds equal the CSS viewport. | PASS |
| AC-04 | Filter/Sort groups were distributed through drawer height; Schedule title/close geometry differed. | Returned sections to normal flow, kept only the footer at the bottom, retained the authorized Class filter, and aligned drawer headers/close controls. | Drawer measurement and keyboard/browser journey. | `reference/application-{filters,sort,schedule}-*.png` | PASS |
| AC-05 | Boxed status badges and generic action icons differed from the frozen Attendance treatment. | Added scoped dot-and-text table statuses, approved Review/History icons, compact contextual actions and consistent Attendance control/footer geometry. | Four themes, both responsive projects, and direct visual inspection. | Listing/detail/history/correction pairs plus theme captures. | PASS |
| AC-06 | Correction context was ungrouped; prior request-review evidence showed only an explanation and initially captured a loading state. | Grouped student/context and recorded mark in the approved surface. Captured loaded explanation review. A guarded real-PostgreSQL journey now creates, routes and captures the distinct correction-request review, then applies it only at final confirmation. | Explanation owner functional suite; correction-request desktop/mobile browser journey; correction owner functional suite. | `application-correction-request-review-{chromium,mobile}.png`, frozen `reference-correction-request-review-*`, correction and explanation drawer captures. | PASS |
| AC-07 | Final-build recovery evidence was incomplete. | Current connected tests capture exact-key unknown correction and recovered saved states. Existing components retain committed-save/failed-refresh separately and refresh by GET only; owner functional coverage exercises explanation decisions and correction-request stale/denied rules. | `recovery-correction-{unknown,saved}-{chromium,mobile}.png`; focused unit/functional/browser results below. | Recovery states are production extensions where the frozen mock has no exact screen; they use established drawer feedback patterns. | PASS, with extension disclosed |
| AC-08 | Earlier measurements omitted reference elements and overgeneralized from Registers. | Captured both surfaces and state-specific geometry at all four viewports; generated separate extended and theme records. | 135 reviewed files, including 48 primary captures, 60 extended state captures, 16 theme captures and three JSON records. | Side-by-side/overlay index plus manually inspected representative pairs. | PASS |

## State-by-state evidence

| State | Directly compared | Functionally exercised | Notes |
|---|---:|---:|---|
| Registers, search, Filters, Sort, pagination | Yes, 4 viewports | Yes | Production identifiers cause explained row-height differences. |
| Single-date calendar | Yes, 4 viewports | Yes | Touch targets remain 44px on coarse/mobile input. |
| Register detail, roster, counts and History | Yes, 4 viewports | Yes | Roster retains authorized admission number. |
| Schedule drawer | Yes, 4 viewports | Yes | Required validation and assignment authority unchanged. |
| Correction drawer | Yes, 4 viewports | Yes | Unknown outcome and exact replay captured from final E2E source. |
| Cancellation drawer | Yes, 4 viewports | Yes | Retained submitted records and immutable cancellation history verified. |
| Requests queue and explanation review | Yes, 4 viewports | Yes | Current demo contains an assigned fictional explanation. |
| Correction-request review | Yes, desktop/mobile production; frozen reference at 4 viewports | Yes, desktop/mobile | Guarded test database supplied the owner-valid routed request; development fixtures were not broadened. |
| Reports, period calendar, sort, direct CSV control | Yes, 4 viewports | Yes | CSV permission and current report projection remain authoritative. |
| Missing-register drawer | Yes, 4 viewports | Yes | Full-viewport positioning and internal scroll measured. |
| Confirmed save followed by failed refresh | Reference-less production recovery extension | Yes in focused component/owner coverage | UI retains the receipt, labels the save as confirmed and exposes read-only refresh; no mutation retry is offered. |
| Explanation accept/decline/clarification | Loaded review directly captured; terminal variants are reference-less | Yes in real-PostgreSQL coverage | Protected narrative mode remains synthetic-only. |
| Correction request stale/source-changed and revoked access | Frozen reference plus owner evidence; not all terminal states recaptured in this demo | Yes in real-PostgreSQL coverage | Current authorization is rechecked before disclosure or replay. |

## Verification results

Commands were run sequentially. Test wrappers were inspected before arguments were supplied.

- `pnpm exec eslint components/attendance/ui.tsx components/attendance/register-workspace.tsx components/attendance/requests-workspace.tsx components/attendance-scheduler.tsx test/e2e/attendance-sessions.spec.ts` — PASS. CSS is outside the ESLint configuration and reported only the expected ignored-file warning when included.
- `pnpm typecheck` — PASS.
- Focused Attendance unit files — 33/33 PASS. Later changes were scoped CSS, accessible Schedule label composition and evidence capture assertions.
- `pnpm test:functional test/functional/attendance-sessions.test.ts test/functional/attendance-explanations.test.ts test/functional/attendance-correction-requests.test.ts --maxWorkers=1` — 17/17 PASS against guarded PostgreSQL.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/attendance-sessions.spec.ts --project=chromium --workers=1` — 1/1 PASS.
- The same command with `--project=mobile` — 1/1 PASS.
- `VSCHOOL_E2E_BUILT=1 pnpm test:e2e test/e2e/principal-attendance-correction-request.spec.ts --project=chromium --workers=1` — 1/1 PASS after the test was moved to the current consolidated request drawer.
- The same command with `--project=mobile` — 1/1 PASS.
- Each browser run reported 123 applied test migrations and none pending.
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build` — PASS; build `RscvfUEa7EzLAioXBK7Dx`.
- `git diff --check` on the intended application/test files — PASS.

The first attempt to extend the correction-request E2E captured the correct review drawer but then continued through the obsolete standalone reviewer page and timed out looking for its former field. The test was corrected to complete the current consolidated staged drawer; both final desktop and mobile runs passed. No assertion was weakened.

## Measured comparison and deviations

The JSON files record reference and application rectangles, padding, font family/size/line height, gaps, device scale, root overflow and drawer header/body/footer geometry. Identical drawer structures now agree at the viewport boundary: desktop drawers are 470px wide and mobile drawers are the full 390×844 or 360×800 viewport.

Remaining differences are explicit:

1. At 900px the frozen standalone reference keeps its 242px sidebar while the application’s established shared shell switches to the compact top header. Changing that shared breakpoint would affect every workspace and was outside this Attendance-only correction.
2. Production register/request rows can be taller because the current contract displays Teacher, admission number and authorized operational context omitted by the fictional reference. The compact hierarchy and actions match; the additional content was retained deliberately.
3. The reference uses its bundled Inter asset. The application computed font and `document.fonts` result are recorded in each measurement. Font assets were not changed in this slice.
4. Four-theme screenshots use an ephemeral, test-only `data-vs-theme` override on the rendered shell to inspect the existing tokens consistently. They are presentation evidence, not theme-persistence evidence and do not modify stored appearance.
5. The frozen prototype has no exact unknown-result, failed-refresh, stale or revoked-access screens. These are labelled production design extensions and retain the established Attendance feedback/action hierarchy.

Native assistive-technology testing, TEN-03, production deployment and human visual acceptance remain pending.
