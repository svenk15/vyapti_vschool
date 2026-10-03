# Shared VSchool experience system — current state

DS-01 locally verified and accepted on 3 October 2026. No active timer. Gallery previews do not imply operational school features.

| Task | Implementation | Human review | Evidence |
|---|---|---|---|
| DS-01 | VERIFIED | PASSED | [Local evidence](../../evidence/ds-01-local/verification.json); 26 unit, 4 PostgreSQL and 20 browser tests passed |
| DS-02 | NOT_STARTED | NOT_REQUESTED | No implementation evidence |

## Implemented now

Shared component primitives and interactive gallery, including CSV/2 MiB rejection and recovery, associated live field errors, and dialog/drawer boundary keyboard focus wrapping. Shared palettes, table interactions, forms, overlays, tabs and feedback are covered by local checks. Full WCAG conformance and native assistive-technology validation are not claimed.

## Next action

Owner accepted DS-01 and authorized the next task. BRD-01 selected using pnpm next-task. See branding CURRENT_STATE for the current demo.

## Evidence and feedback

Append exact source revision, test reports, DB migration state, demo identity, limitations and human feedback here. No live institution or pupil data is bundled.

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
