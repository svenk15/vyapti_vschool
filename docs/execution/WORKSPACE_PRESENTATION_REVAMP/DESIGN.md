# Five-workspace presentation revamp

## Scope and authority

This programme consolidates the production presentation mechanics used by the Administrator, Teacher, Student, Parent/Guardian and Principal workspaces. The approved Refined Forest concept sets the visual direction. The live route contracts, server authorization and owner DTOs remain authoritative for data and available actions.

The detailed Administrator reference and component contracts remain in [`../VSchool_Execution_Pack/references/approved/implementation-spec/START_HERE.md`](../VSchool_Execution_Pack/references/approved/implementation-spec/START_HERE.md). Existing route and state classifications remain in [`../UX_REVAMP/SCREEN_MAP.md`](../UX_REVAMP/SCREEN_MAP.md); this programme links that inventory instead of replacing it.

No business capability, permission, module availability rule, persistence contract or migration changes in this programme.

## Canonical implementation

| Concern | Owner | Contract |
|---|---|---|
| Protected desktop shell and mobile drawer | `components/portal/portal-shell.tsx` | One desktop sidebar, fixed account footer, independently scrollable navigation, accessible modal drawer and focus return |
| Navigation group mechanics | `components/portal-navigation-group.tsx` | Active-route matching, one nesting level, disclosure state, child alignment and explicit major-section spacing |
| Role catalogues | `components/workspace-navigation.ts`, `components/principal-navigation.ts`, `lib/server/admin-navigation.ts` | Role-specific information architecture and server-filtered destinations |
| Parent/Student context | `components/family-portal-frame.tsx`, `components/student-portal-frame.tsx` | Shared shell plus child/Student context and existing bottom navigation |
| Tokens and component recipes | `app/globals.css`, `components/ui/**` | Semantic theme tokens and shared control/page recipes |

The shell receives already-authorized navigation and display context. It does not fetch protected data or decide authorization. Each destination retains its own server authorization.

## Sidebar geometry

Desktop uses a 240px sidebar. Navigation has 16px horizontal padding, 4px adjacent-row/group gap and an additional 8px only on groups marked `sectionBreakBefore`, producing the intended 12px major-section separation. Rows are at least 44px high with 12px padding, 8px radius, 20px icons with 1.75px strokes, a 12px icon/label gap and Inter at 14px/20px. Collapsible child content starts 32px inside the group; with row padding this aligns child text to the parent label edge without child icons.

The sidebar has three flex regions: brand/context, an independently scrolling navigation region and a fixed account/sign-out footer. Long names use accessible full labels and visual truncation. Empty groups are removed before rendering.

At widths below 1024px the shell uses a modal drawer sized `min(320px, 100vw - 32px)`. The drawer traps focus, closes on Escape/backdrop/destination navigation and returns focus to the opener. Parent and Student bottom navigation remains separate and reserves content/focus space through safe-area-aware padding.

## Shared page contract

- Main desktop/intermediate/mobile padding: 32px / 24px / 16px.
- Main section gap: 24px; related controls: 8–12px; form fields: 16px.
- Cards: 24px desktop and 16px mobile padding, 12px radius.
- Page title: 28px/36px at desktop and 24px/32px on mobile.
- Section heading: 18px/26px. Body: 14px/22px. Supporting text: 12px/18px.
- Desktop controls are at least 40px; mobile/coarse-pointer controls are at least 44px. Mobile editable text is 16px.
- Tables retain semantic markup and use labelled record cards where a table is not readable on mobile.

The existing page, directory, detail, form, staged-workflow, review, receipt and recovery recipes in `components/ui` and the UX revamp remain the production primitives. Later workspace batches may correct a page composition, but may not change this shell contract without checking all five representative consumers.

## Current checkpoint

The first slice replaces role-local Parent/Student drawer implementations with `PortalShell`, applies explicit section spacing to all five role catalogues, removes the Administrator-only CSS exception and verifies the shared shell at 1440×1000, 1280×800, 900×900, 390×844 and 360×800. The page-by-page correction batches remain tracked in [`PAGE_COVERAGE.md`](PAGE_COVERAGE.md).
