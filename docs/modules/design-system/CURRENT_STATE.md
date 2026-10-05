# Shared VSchool experience system — current state

DS-01 locally verified and accepted on 3 October 2026. No active timer. Gallery previews do not imply operational school features.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| DS-01 | VERIFIED | PASSED | [Local evidence](../../evidence/ds-01-local/verification.json); 26 unit, 4 PostgreSQL and 20 browser tests passed |
| DS-02 | BLOCKED | PENDING | Browser and production-build checks pass; native VoiceOver and NVDA review requires unavailable assistive-technology access |

## Implemented now

Shared component primitives and interactive gallery, including CSV/2 MiB rejection and recovery, associated live field errors, and dialog/drawer boundary keyboard focus wrapping. Shared palettes, table interactions, forms, overlays, tabs and feedback are covered by local checks. Full WCAG conformance and native assistive-technology validation are not claimed.

The shared administrator/teacher shells and the common AuthLayout now compose protected workspaces and account flows. Published palette resolution is active-member/branch scoped, honors branch-over-institution inheritance, and ignores drafts; branding preview renders shared production components in an isolated local subtree. The dashboard links institution branch administration to its own workspace. See [route coverage](ROUTE_COVERAGE.md); its family-level review remains in progress and visual acceptance is PENDING.

## Next action

DS-02 remains implementation-in-progress until route-family rendered review is complete. The focused shared-shell, theme publication, and showcase journeys pass, but not every implemented route or true native 200% zoom has been inspected. VoiceOver and NVDA sessions remain outstanding and cannot be claimed from browser automation. ATT-02 and BRD-02 are VERIFIED/PENDING; pending human acceptance does not block implementation under the current execution policy. Continue route coverage and remaining authorized Phase 1 work without calling accessibility conformance or release readiness complete.

## Evidence and feedback

Append exact source revision, test reports, DB migration state, demo identity, limitations and human feedback here. No live institution or pupil data is bundled.

### DS-02 implementation checkpoint — 5 October 2026

Added the shared `ServerTable` semantic presentation and integrated the authorized branch-context switcher after headings across protected admin and teacher flows, retaining branch management only on pages that already exposed it. Replaced the branch-change confirmation markup with the shared native dialog. Report presentation now uses shared fields, table and empty state. Server-owned filtering and authorization remain in the owning gateways/use cases; branch selection remains server reauthorized. E2E coverage exercises keyboard confirmation/cancel and focus restoration, mobile/360px and 2x scaling, reduced motion/forced colors, context propagation and protected report/attendance success and denial paths.

Verification on the implementation source before this documentation-only update: `pnpm check` passed (lint, typecheck, docs, database design, boundaries, backend compile and unit tests); `VSCHOOL_E2E=1 pnpm build` passed to isolated `.next-e2e` (build ID `8DrFO2ZwwJDeli_7hBUTu`); `pnpm test:e2e test/e2e/attendance-sessions.spec.ts --project=chromium` passed 1/1; the same spec on `--project=mobile` passed 1/1; `pnpm test:e2e test/e2e/tenancy.spec.ts` passed the branch desktop/mobile journeys (4/4), and a focused rerun of its corrected module-configuration desktop/mobile journeys passed (2/2). These Playwright journeys used the dedicated real PostgreSQL test database. Post-checkpoint `pnpm check:docs`, `pnpm check:db-design`, `pnpm check:boundaries`, `pnpm check:backend`, and `git diff --check` also passed. No schema, migration or seed change was required.

Production build demo: `http://127.0.0.1:3429` (DS-02 build ID above; standalone server). `/sign-in` returned 200; `/admin` and `/teacher/today` redirect unauthenticated users (307); `/admin/reports/attendance` redirects to sign-in (307). Sign in using the fictional administrator in ignored local credential file `artifacts/people-02/private-demo.json`. Manual review: (1) open the admin attendance report and confirm the institution-context panel follows the heading and the report has a captioned semantic table; (2) use Tab to focus an authorized alternate-branch control, open its confirmation dialog, verify Tab/Shift+Tab stay in the dialog, press Escape and confirm focus returns; (3) confirm a branch switch and observe the page reload with its server-provided context; (4) open `/teacher/today` and submit a scheduled attendance session, then verify the saved roster/status; (5) resize to 360px and browser zoom 200%, checking no page-level horizontal overflow. Human review is PENDING.

Limitations/blocker: automated forced-colors and reduced-motion browser emulation is recorded, but actual native VoiceOver and NVDA use has not been performed because this environment provides neither a VoiceOver session nor Windows/NVDA access. These explicit DS-02 design/task criteria remain unverified; implementation status is BLOCKED rather than VERIFIED. Request access to a native VoiceOver device/session and a Windows/NVDA session, record results separately, then rerun any affected focused browser check. No WCAG conformance claim is made. Next action: obtain that assistive-technology access; separately, wait for explicit ATT-04 human acceptance for RPT-02 and TEN-03. No independent task currently meets its documented dependencies.

### Remaining manual acceptance checklist

Mac VoiceOver (owner-run; DS-02 remains BLOCKED until results are recorded): use the demo above in Safari with VoiceOver enabled. Navigate by keyboard/VoiceOver commands, checking that (1) the report heading, institution/branch context, filter labels, Apply filters button, and table caption/column and row headers are announced with their roles; (2) the context panel’s current institution/branch is read before its switch controls, and only authorized alternate branches are offered; (3) activating a switch opens a dialog announced as “Switch branch?” with its description and Stay/Continue buttons, focus begins on Stay, Tab/Shift+Tab move between both controls without escaping, Escape closes it, and focus returns to the originating branch button; (4) reopening and activating Continue reloads the page and the new current context is announced; (5) on `/teacher/today`, the date control, refresh action, session status/details link and empty/error feedback have useful names/roles and logical focus order. Record macOS/Safari/VoiceOver versions and any missing/misordered announcement or focus trap; do not treat passing this checklist as NVDA evidence.

NVDA requirement (still OUTSTANDING): Bible §17 requires a Windows/NVDA pass before production; DS-02 DESIGN.md and TASKS.md separately require VoiceOver and NVDA sessions, not accessibility snapshots. NVDA must cover the same production journeys: authorized admin report/server table and branch-context switcher/dialog, including announcements, keyboard order, focus containment/return and context reload; teacher day/session navigation and attendance success, unknown/conflict or denied feedback. Record Windows, browser and NVDA versions, exact result and defects. Keep this gate open until an actual NVDA session is performed; neither Playwright nor a Mac VoiceOver pass substitutes.

### DS-01 started — 3 October 2026

Branch main; initial Git status clean at 6fa8158. FND-01 accepted explicitly. Intended demo: shared palettes, forms/errors, table search/sort/pagination and keyboard-operable overlays/tabs at desktop/mobile widths. Review found file selection only reports oversize files in gallery text and does not reject them in the shared FileUpload. Implement the documented CSV/2 MiB selection contract centrally with associated error and recovery. No database writes, authorization flow, new dependency or migration is needed. Native assistive-technology and full production accessibility review remain DS-02 gates.

### DS-01 local verification and demo — 3 October 2026

Implementation VERIFIED; human review PENDING. Branch main, baseline `6fa8158` (tested FND-01 executable baseline `fd1ba58`). Tested dirty-source fingerprint `e0b1f633f6dcbb15f91303188192f82a69a9b62d64640a91ef0580bc345e6520`: SHA-256 over sorted changed executable paths + NUL + contents + NUL, for components/component-gallery.tsx, components/ui/forms.tsx, components/ui/interactive.tsx and test/e2e/design-system.spec.ts, combined with the clean baseline. The source checkpoint is the commit containing this record, identifiable through Git history; its SHA is provided in the owner handoff to avoid self-reference. No source change occurred after the checks/build.

Changes: centrally reject unsupported file extensions and sizes above 2 MiB, clear rejected selections and prior consumer selection, associate/announce field errors, and recover on valid replacement. Added explicit visible-enabled-control Tab/Shift+Tab wrapping to the native dialog/drawer. Gallery consumes the shared file-selection result without duplicating validation. Added four browser journeys per project for file rejection/recovery, modal/drawer focus, 360px palettes/negative states/preferences and keyboard forms/disclosure. DESIGN inventory and Bible changelog reflect these contracts. Platform CURRENT_STATE records explicit FND-01 acceptance; its old demo was stopped for this authorized update.

Environment: owner’s macOS, Node 24.20.0, pnpm 11.25.0, PostgreSQL 16.15 (Homebrew), Next 16.3.8. Existing private development/test configuration preserved. No new dependency, lockfile, schema or migration change. Dedicated test database `vyapti_vschool_test` reported all 3 existing migrations applied and none pending. Development database `vyapti_vschool` serves ready=true through the production app. No DS persistence exists; foundation tests remain the applicable real PostgreSQL regression suite. No database reset or deletion was performed.

Executed verification:

- `pnpm check`: exit 0, lint/typechecking/docs/database-design/boundaries/backend compilation and 26 unit tests passed. [Unit JUnit](../../evidence/ds-01-local/unit.junit.xml). A later `pnpm lint` after the final browser test addition also exited 0; the production build typechecked the final source.
- `pnpm test:functional`: exit 0, 4 real PostgreSQL foundation tests passed. [Functional JUnit](../../evidence/ds-01-local/functional.junit.xml).
- First expanded `pnpm test:e2e`: exit 1, 16 passed and 2 focus-wrapping checks failed (desktop/mobile). Fixed shared dialog boundary behavior; next run exited 0 with 18 passed. Added the remaining native form/disclosure journey. Its initial rerun was blocked at migration connection by the sandbox (exit 1); approved retry exited 0 with all 20 tests passed (10 desktop + 10 mobile). [Final browser JUnit](../../evidence/ds-01-local/e2e.junit.xml).
- File scenarios: valid uppercase .CSV, wrong extension, 2 MiB+1 byte rejection, exactly 2 MiB acceptance, valid replacement and cleared selection. Asserted no mutating network requests, no stale selected filename and accessible field error/hint transitions.
- Browser scenarios: native dialog/drawer Tab and Shift+Tab wrapping, Escape and returned trigger focus; all three palettes at 360px without page overflow; disabled/loading controls; described invalid email; Home/End/wrapping tabs; no-match table recovery; tooltip Escape; native checkbox/switch/radio/date/disclosure interactions and preserved entered text. Reduced-motion/forced-color emulation checks verify stopped spinner animation and a visible focus outline; they do not certify a complete accessibility audit.
- `pnpm build`: exit 0; production compilation, TypeScript and route generation passed. Build ID `vX1DSkp8YlmBhlUPTGAY6`.
- `pnpm check:docs` and `git diff --check`: exit 0 after documentation updates.
- `pnpm start`: stable production server in session 71827 at port 3400. HTTP probes outside restricted local sockets confirmed health ready=true and /design-system status 200 with gallery, file-picker and field-error markup. [Safe demo identity](../../evidence/ds-01-local/verification.json).

Reviewed the 360px Forest screenshot: controls stack within the viewport, error/help text remains visible, and the wide sample table stays inside its focusable horizontal-scroll region. [Desktop screenshot](../../evidence/ds-01-local/gallery-desktop.png) and [360px screenshot](../../evidence/ds-01-local/gallery-360px.png). All palettes were captured by browser tests; remaining screenshots and traces stay in ignored artifacts.

Manual review at http://127.0.0.1:3400/design-system:

1. Select Forest, Indigo and Clay. Expect shared colors and readable feedback; narrow to 360px or try browser 200% zoom and inspect controls.
2. Search/sort/page the sample roster, try an unmatched search, then clear it. Expect a helpful empty state and restored sample rows.
3. Open confirmation and record details. Tab/Shift+Tab through each; expect focus to stay inside. Press Escape; expect focus to return to the opening control.
4. Select a synthetic .txt file or a CSV larger than 2 MiB. Expect a field error and cleared selection. Select a small synthetic CSV; expect the error to clear and a local-selection notice. No upload occurs.
5. Use arrow/Home/End keys on feedback tabs; inspect loading/error states and toggle native form controls. Expect selected tab/focus to agree and entered sample text to remain.

Limitations: synthetic UI only. File extension/size checks are local selection feedback, not CSV content validation or server-side security. No new protected flow or business data is implemented. Manual native 200% zoom, VoiceOver/NVDA, Safari/Firefox, full contrast-state/high-contrast and production accessibility certification remain pending DS-02/release work. Human acceptance remains PENDING for this DS-01 source. Next action: keep the demo stable and await owner feedback before BRD-01 or any other task.

### DS-01 owner acceptance — 3 October 2026

Owner feedback: “Pass, please go-ahead and implement next task”. Human review PASSED for source 08aeb86cec7aaa89f565b0cc58fbdf647fe06976 and its recorded production build. The accepted demo is stopped for the authorized BRD-01 update; pause again at the next review checkpoint.
