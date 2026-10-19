# Administrator experience revamp

Status: active presentation programme. Functional owner contracts, route URLs and server authorization remain authoritative.

## Outcome

The implemented Administrator workspace uses one task-oriented navigation, one shared shell and the existing production page recipes. The connected reference at `/design-system/admin-reference` uses the same React primitives, Inter assets, icons and semantic tokens with deterministic fictional data and never calls a write API.

The approved order is shared shell and controls, Today and Students; Staff/School/Academics; Attendance/Timetable; Communication/Calendar/Assessments; then Admissions, Imports, Requests, Reports and enabled services. Each route is corrected through its owning component. No business command, permission, module gate, persistence contract or migration changes in this programme unless a concrete route cannot retain its existing behavior without an owner-approved contract change.

## Shared composition contract

- Desktop uses a 240px sidebar, 64px top bar, independently scrolling menu, 32px content padding and 24px primary section gaps. Intermediate and mobile padding reduce to 24px and 16px.
- Today is direct. Task areas are one-level disclosures. Multiple groups may remain open, the active group is always revealed and cannot be collapsed over its current route, and a fresh Today visit starts with task groups closed.
- Child routes do not repeat top-level icons. Current, expanded, hover and keyboard-focus states remain distinct. The mobile drawer retains focus containment, Escape dismissal, return focus and 44px targets.
- Footer identity shows the available display name and role separately. Missing names use an honest account label; email is not used as a substitute.
- Page headers contain one primary action. Directories use the shared search/filter/sort recipe only when supported by server query contracts. Records use URL-addressable local sections. Staged commands mutate only at their existing confirmation boundary and preserve existing replay/stale recovery.
- Control sizing follows the approved implementation spec: 40px desktop standard controls, 36px compact table actions, 44px consequential/mobile actions, 8px radius, 14px labels/body and 12px supporting text.

## Authority and availability

Navigation visibility remains a convenience projection. `getAdminNavigation` resolves current membership capabilities plus release, entitlement and branch activation. Dynamic destinations use their existing owner availability/read boundary. Every destination and command independently reauthorizes the current account, institution, branch, module and resource relation.

Staff is one sidebar item with authorized local tabs for Profiles, Access and Availability. Its entry route is the first destination the current account may use; an access-only administrator therefore reaches `/admin/users` without crossing a profile-only route. Attendance explanations appear only after the existing reviewer-availability check. Correction requests remain contextual because the owner has no lightweight navigation-availability contract; fetching protected cases just to render navigation is prohibited.

## Connected reference

`/design-system/admin-reference` currently covers Today, Students directory, Student record and registration stages/receipt plus populated, empty, validation and stale examples. It uses shared `PageHeader`, toolbar/drawers, tables, record/staged-form recipes and navigation-group components. Its data is labelled synthetic and interactions are local/read-only.

## Verification boundary

Every route is assigned a composition status in [PAGE_COVERAGE.md](PAGE_COVERAGE.md). A shared-pattern pass is distinct from direct reference/application comparison. Functional evidence may be reused only when the underlying backend and interaction contract is unchanged. Human acceptance, native VoiceOver/NVDA, TEN-03 and production release remain separate gates.

