# EX-01 visual baseline

Captured 9 October 2026 for executable baseline `61f619e58093925bb20433e839f6ac375654b659` and execution-pack integration commit `ca9e683`. Human visual review is PENDING.

## Capture provenance

- `reference/` contains newly rendered screenshots of the six approved static HTML references pinned in `docs/execution/ROUTE_REFERENCE_MAP.md`. Desktop captures use a 1440 × 1000 viewport; mobile captures use 390 × 844 where present.
- Most `actual/` route screenshots are copied into durable evidence from the existing exact-baseline captures in `artifacts/portal-ux-final/after/` and `artifacts/fnd-02-demo/`. The executable application files are byte-identical to baseline `61f619e`; EX-00 changed documentation and tooling only.
- `teacher-unavailable-*` and `teacher-admin-denied.png` are new live captures from the same executable baseline at `http://127.0.0.1:3400`. They record safe unavailable and permission-filtered states. They are not empty-session evidence.
- The in-app browser runtime could not start because its installed launcher referenced a missing browser-service module. Repository Playwright was used instead; screenshots were then inspected directly. This is a tooling limitation, not a passing browser-control result.

The manifest records file hashes, viewport families and capture sources. No schema, migration, database write, seed or product source change was made for this task.

## Route families and target use

| Actual route/state | Family | Approved reference | EX-01 decision |
|---|---|---|---|
| `/sign-in` | Authentication | School administrator sign-in | Preserve real branding and recovery behavior; adopt only the approved composition in EX-04. |
| `/admin` | Overview | School administrator | Adopt the enhanced navigation shell in EX-02. Keep current real task cards; do not copy prototype timetable/counts. |
| `/admin/settings/school` | Settings/form | School administrator | Preserve the implemented constrained form and real branches. Navigation changes only in EX-02. |
| `/admin/students` | Directory/table | School administrator | Preserve real owner query and authorization. Toolbar work belongs to EX-03/EX-08. |
| `/admin/reports/attendance` | Report | School administrator | Preserve real report semantics and export authorization. Presentation adoption belongs to EX-12. |
| `/teacher/today` | Teacher task | Teacher | Add role-appropriate shared navigation in EX-02. Preserve the real three-session populated state and unavailable state; do not expose unsupported class/history links. |
| Teacher request to `/admin` | Permission state | Teacher navigation | Continue server-filtering destinations. The captured “No active workspaces” state exposes no administrator links or data. |

Operator, parent, student and principal references are visual/product authority for later owner-capability waves. Their identities and protected workspaces do not exist in the current release, so EX-01 does not authorize routes, role emulation or prototype data for them.

## Visual findings frozen for EX-02

1. The current administrator sidebar has useful server-filtered grouping and a 248px desktop footprint, but uses a light surface. The approved enhanced navigation uses the forest surface, consistent outline icons, stronger selected/focus states and a reachable identity footer.
2. The current teacher workspace uses header-only navigation. The approved teacher reference establishes the same role-appropriate left-navigation pattern without granting unsupported destinations.
3. The current protected header repeats institution/branch context in a wide control. The target keeps this context compact while preserving the current server-authorized switch behavior.
4. The current mobile administrator drawer is a tall light overlay; the captured viewport does not expose identity or sign-out. The target uses the shared dark grouped navigation, scrollable destinations, focus containment/return and a reachable identity footer with a separate real sign-out action.
5. Current page bodies remain authoritative until their scheduled slices. Approved prototype values, future timetable screens, unavailable cards and unsupported links must not become production behavior.

## State coverage and limitations

The evidence includes populated administrator and teacher pages, desktop/mobile protected layouts, the administrator mobile menu, a teacher schedule-unavailable state and a permission-filtered teacher-to-admin state. Existing exact-source Playwright evidence covers loading/error recovery in the implemented journeys, but EX-01 does not claim a newly captured true zero-session state: both available fictional teacher accounts currently resolve either the populated 6 October scenario or a safe schedule-unavailable result for the queried context. No fixture or context was changed to manufacture a screenshot.

Native VoiceOver, NVDA and native 200% zoom remain outstanding DS-02 release evidence. TEN-03 remains an incomplete production gate. EX-01 freezes visual targets; it does not establish accessibility conformance or production readiness.
