# Leadership UX contract
Reuse Operator 03.9, School Administrator 01, Teacher 01, Parent & Guardian 01 and Student 01 visual language. The workflow explorer supplied here is a product-specification reader, not a production screen pack.

## Information architecture
Use five familiar groups: My day; Attendance & pupil support; Teaching & staff; Families & notices; Reviews & reports. My day surfaces current priorities, assigned follow-ups and decisions. Add only released and permitted activities; hide empty groups. Account, help and sign out remain utilities. See SIMPLIFIED_UX.md for the complete plain-language navigation and state contract. These UI groups do not merge backend ownership or change module entitlements.

Institution/branch context remains visible. Principal/acting role appears with the user's name at the left bottom. Sign out is a separate session action. Audit/report destinations that are peers never appear as children of unrelated menu items.

## Reusable compositions
- Shared shell: 240px sidebar, 60px topbar, 32px desktop and 20px mobile gutters; compact labelled stroke icons.
- Hierarchy: 28 title, 18 section, 14 body, 13 nav/control, 12 metadata, 11 group labels. Use shared semantic tokens; calm forest default.
- Controls: 40px desktop and 44px touch targets. Common spacing 4/8/12/16/20/24/32. No arbitrary per-page component sizing.
- Evidence card: definition, value, denominator where relevant, source cutoff/completeness, explicit View records.
- Attention list: factual issue, branch/class/session, owner, due, source state and one appropriate next action.
- Attribute search: compact default attribute, enter-to-search; no visible Search button. Whole group does not highlight when dropdown opens; actual keyboard focus stays visible.
- Filters: side panel; unboxed collapsible attribute names with dividing lines; persistent multiselect; no default selections; OR within attribute, AND across attributes; Cancel/Apply only.
- Sort: separate side panel with expanded Sort by and Order by radio groups.
- Table: semantic caption/headers, content-sized View/Manage actions, no redundant Actions button or unexplained ellipsis. Mobile shows labelled records.
- Review: explicit source, recipient/assignee, due and consequence before confirm. Back left, primary action right; meaningful Save draft and leave below if that flow supports drafts.
- Outcome: known state, reference, time, scope and next step. Unknown offers Check status, not a new blind command.

## Workflow states to design
Loading; empty but valid; module unavailable; forbidden/expired; source stale; missing evidence; validation error; unsaved changes; exact duplicate; changed source/assignee; concurrency conflict; delivery failure; uncertain result; partial bulk outcome; evidence ready; verified closure; reopen.

Every state requires sensible recovery and honest wording. Acknowledged, approved, delivered, accepted, completed and closed cannot be interchanged.

## Screen inventory for first slice
Leadership home; missing-register list; session evidence; create/review follow-up; pending/result receipt; follow-up details/timeline; verify/reopen dialog; history/report evidence; branch switch; sign-in/account. Every critical action must work on desktop/mobile and keyboard. Reference screenshots alone cannot establish behavior or accessibility.

## Human validation
Ask a principal/coordinator to find the missing register, explain the denominator, identify the source owner, create one follow-up and verify a real receipt. Observe confusion instead of asking only whether the screen looks good. Verify screen reader, native zoom, touch and long/translated labels on the implemented product.
