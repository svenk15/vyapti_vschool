# Shared VSchool experience system — tasks

Read DESIGN.md and the current Bible. These are vertical slices; previews do not prove persistence or authorization.

## DS-01 — Review and adopt the shared UI foundation

Depends on: FND-01

### Implementation instructions

Use the included component gallery. Review all controls and three palettes, data table sort/search/pagination, dialog/drawer keyboard behavior, tabs/errors/loading, branding and responsive composition. Improve components centrally, not by module-specific duplication. Record visual owner acceptance separately from automated checks; update UI inventory and token contracts.

### Acceptance and test strategy

Run pnpm check, applicable PostgreSQL functional and Playwright suites, and production build. Capture source fingerprint/commit and actual test commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/ADRs in the same checkpoint.

### Demo and checkpoint

Visit /design-system; change palettes; search/sort/page sample table; open modal, Escape, verify focus; use arrow-key tabs; inspect mobile form and error state.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.

## Wave A approved experience adoption — EX-00 through EX-15

The executable presentation queue is [modules/experience/TASKS.md](../../execution/VSchool_Execution_Pack/modules/experience/TASKS.md). Execute it in dependency order and use the canonical owner tasks for every business operation. EX-00 pins live contracts and references; EX-01 captures comparable states; EX-02–EX-03 establish shared navigation and interaction recipes; EX-04–EX-12 adopt existing Access, Branding, People, Academics, Students, Imports, Attendance and Reporting operations; EX-13–EX-15 complete fixtures, integrated verification and the delivery checkpoint.

Every EX slice records a short design delta, current-source verification, migration state, demo route and human review separately. Presentation work does not reopen a previously verified owner task or satisfy DS-02 native accessibility gates. Missing backend capability follows BE-03 and remains unavailable until its owner contract is designed and verified.

## DS-02 — Validate production screen recipes and accessibility

Depends on: DS-01, ATT-02, BRD-02

### Implementation instructions

Integrate shared components into every implemented page route, `/design-system`, authentication and branding preview/publish flows. Keep the grouped desktop/mobile shell role-appropriate, remove branch creation from the overview, and make protected shell themes resolve only published branch/inherited institution palettes after active membership validation. Use shared AuthLayout for generic sign-in, activation, invite and recovery; retain the school-branded login composition. The gallery and brand preview must render production components. Record a route-family coverage matrix and actual screenshots. Specialized future widgets remain gated before their consuming module; do not claim all are already implemented.

Use the shared semantic server-table presentation for server-authorized report rows; keep filters and cursor ownership in the server-backed feature. Put the existing authorized branch switcher after the page heading across protected admin/teacher workflows, and use the shared dialog for discard confirmation. UI visibility never replaces current server authorization.

### Acceptance and test strategy

Run focused lint/type/build checks, real PostgreSQL authorization/publication checks for effective palette reads, and desktop/mobile Playwright routes for the changed shared patterns. At a coherent checkpoint run required repository checks and production build. Capture source fingerprint/commit and actual commands/exits. Validate the documented negative cases, not only the happy path. Update module state and affected Bible/LLDs in the same checkpoint.

Browser evidence covers every implemented route family at 1440px and 390px, representative shared patterns at 768px, 360px and 200% zoom, branch switching, mobile menu keyboard/focus return, current-context propagation, forced-colors/reduced-motion emulation, theme isolation/publication/inheritance, semantic server-table names, and report/attendance success, unknown-result and denial recovery. Record actual VoiceOver and NVDA use independently; an accessibility snapshot is not a substitute. The route coverage document must distinguish reviewed routes from pending routes. Human visual acceptance remains a separate PENDING gate.

### Demo and checkpoint

Inspect `/design-system` palette preview and the protected overview, roster, attendance/report, branding preview/publish, teacher day, and generic authentication/recovery screens. At each available palette, confirm the published theme appears after refresh and Cancel preview leaves the published portal unchanged. Complete login → branch switch → attendance submission using keyboard and mobile; demonstrate conflict recovery, labels and shared styles across setup/roster/reports.

Start/check the server, give URL and steps, request user review, and mark review PENDING. Do not mark human acceptance until actual feedback.
