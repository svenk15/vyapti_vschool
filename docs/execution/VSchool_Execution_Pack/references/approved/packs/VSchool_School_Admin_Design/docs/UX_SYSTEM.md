# Shared UX system — Operator 03.9 → School Administrator 01

## Foundations

| Token | Value / rule |
|---|---|
| Canvas | `#F7F8F4` |
| Surface | `#FFFFFF` |
| Primary ink / secondary ink | `#213A32` / `#596C61` |
| Border | `#DFE6DF` |
| Forest brand / soft / dark | `#225B49` / `#E9F2EC` / `#153E31` |
| Palette alternatives | Indigo and Clay, inherited from Operator |
| Type | Inter when available; system UI fallback. SVG references use Nimbus Sans |
| Type scale | Title 28; section 18; body 14; controls/nav 13; metadata 12; short category labels 11 |
| Desktop shell | 240px sidebar; 60px topbar; 32px content padding |
| Responsive shell | At 800px, drawer navigation and 20px content gutters; content grid collapses before it becomes cramped |
| Controls | 40px desktop; at least 44px for touch contexts |
| Corners | 8px controls; 12px cards; no pill-shaped primary navigation |
| Spacing | 4/8/12/16/20/24/32/40/48/64; avoid arbitrary per-screen spacings |
| Icons | One consistent 1.7px line family; mostly 18px, 16px in dense row controls; decorative icons hidden from assistive tech |

Category labels are metadata, deliberately smaller than navigation links. Their uppercase weight/spacing and clear grouping establish hierarchy. Avoid page-title icons without a useful purpose. Long names wrap in records; truncation needs a discoverable full value.

## Shared component contracts

| Component | Behavior |
|---|---|
| SchoolShell | Branch identity above navigation, active item with shape and color, role/name at bottom; Sign out is a separate row below a divider |
| PageHeader | One title, one useful description, one primary action. No repetitive “School administration” eyebrow |
| ScopeSwitcher | Only authorized branches; stay/continue confirmation; warn on dirty work; clear scoped caches and reauthorize on switch |
| WorkQueue | Evidence, affected context, owner and one next action. No decorative number without drilldown |
| MetricCard | Named unit, date, denominator/completeness and no-data state. Submission completeness is distinct from attendance rate |
| AttributeSearch | Compact 144px attribute selector (136px mobile), default selected; Enter applies; no explicit Search button; lens does not overlap input |
| Search focus | Selector has its own keyboard outline; typed focused input is emphasized; the entire composite never highlights because its selector is open |
| ListToolbar | Search, Filters and Sort span the table; 8px gaps. Mobile stacks full-width search above equal Filters / Sort controls |
| FilterDrawer | Fluid, borderless collapsible attribute headings; thin separators; multi-select; choosing does not collapse; applied groups can reopen expanded; no default filter selections |
| Filter actions | Only Cancel / Apply in drawer. Clear chips / Clear filters live outside. OR within an attribute; AND between attributes; Cancel discards pending choices |
| SortDrawer | Sort by and Order by radio groups; expanded initially; independently collapsible; Cancel / Apply |
| DataDirectory | Caption, true header cells, consistent row density, exact counts and pagination, loading/empty/error. Names are links, never a whole-row mouse-only target |
| Manage popup | Compact sliders icon + Manage under Actions; grouped View / Manage options; permission-aware; dangerous actions need a reasoned confirmation |
| DetailLayout | Identity + current status + relevant tabs; summary and next action; no unrelated global filter on a detail view |
| WorkflowStepper | Focused task steps, local validation, explicit final review. Back left and Continue right. Save draft and leave is a separate quiet row below, enabled only after user input |
| Draft | In production, owner-private server draft, scoped to institution/branch, revisioned; no secrets. Prototype memory persistence is not the production contract |
| OutcomeReceipt | Durable reference, scope, committed outcome and next action. “Unknown” cannot masquerade as failure or success |
| SchoolSignIn | Institution branding, calm editorial welcome, focused form, recovery path and safe redirect. Branding does not grant authority |
| StateFeedback | Pending, absent, unsubmitted, failed and unknown retain different language and visuals |

## Page recipes

Today uses three useful metrics, an exception worklist, today’s schedule and setup next actions. Directories use the same toolbar/table/Manage composition. Detail screens use shared tabs and record summaries. Forms share labels, errors, review and receipt. Reports show source completeness and definitions before exports. Optional services reuse these recipes and remain hidden when unavailable.

## Themes

Brand palettes change accent, selected surfaces and branded sign-in. Typography, spacing, iconography, navigation behavior and semantics do not change. Green success, amber pending, red error and blue information are stable semantic tokens. Do not let arbitrary client colors produce unreadable content. Validate contrast for every supplied palette, enabled/disabled/hover/focus state and chart legend before publication. Palette preview in this prototype changes review tokens only; it does not publish a client setting.

## Accessibility and resilience

Use visible labels, semantic links/buttons, native radio/checkbox state, error association, keyboard-visible focus, dialog focus containment/return and reduced motion. A blocked action explains why and where to resolve it. Empty states have a next step. Wide tabular data retains an accessible table; directories can become labeled mobile rows. Do not remove useful information at narrow widths.

Native zoom/VoiceOver/NVDA and actual browser rendering remain review gates. This design is not a conformance certificate. Component screenshots alone cannot approve full-page composition.

## Copy

Use “Institution” for Organization and “Branch” for School. Use “Not submitted” before acknowledgement, “Submitted” after a durable receipt, and “Recorded absent” only for actual submitted attendance. Use “Deactivate” with consequences for lifecycle changes; avoid ambiguous “inactive” as an action. “View”, “Review”, “Correct”, “Invite”, “Apply” and “Continue” should accurately describe the next action. Do not expose raw exceptions, token secrets, hashes or database mechanics in user screens.

<!-- EDITION02 -->
## Edition 02 — shared family composition
Use the same SchoolShell, nav icons, branch switch, separate signout, tokens, field errors, semantic table, tabs and dialog recipes. The family controller renders inside the host; all its CSS is scoped to `.family-workspace`. Avoid a second sidebar or a differently themed embedded application. Compact connection rows link to one clear detail; secondary prototype actor/failure controls remain in a collapsed review section. Public-facing copy uses Connect a family, Access starts, Last day of access, Send invitation and Remove portal access.

<!-- EDITION03 -->
## Edition 03 communication recipes
Reuse the same SchoolShell, typed search, separate fluid filter/sort panels, icon vocabulary, page header, semantic status/table and responsive forms. The editor groups Message → Recipients → Review; Back/Continue and secondary Save draft are kept apart. Lead detail with content and the next action, then precise recipient evidence. Parent inbox avoids recipient lists and internal delivery codes. Use the same semantic theme variables; `.comm-workspace` scopes module-specific composition. Review actor/failure controls stay collapsed and clearly fictional.
