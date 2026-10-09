# Shared UX system and teacher compositions

Inherit the shared system from Operator 03.9 and School Administrator 01. Copy `reference/shared-tokens.json` only as a review reference; production must keep one shared token source and component library. Do not fork a parallel teacher design system.

## Foundations

| Token | Default / rule |
|---|---|
| Canvas / surface | #F7F8F4 / #FFFFFF |
| Ink / secondary text | #213A32 / #596C61 |
| Brand / soft / deep | #225B49 / #E9F2EC / #153E31 |
| Borders | #DFE6DF, one consistent fine boundary |
| Type | 28 title, 18 section, 14 body, 13 navigation/control, 12 metadata, 11 uppercase group heading |
| Layout | 240 desktop sidebar; 60 topbar; 32 desktop content gutter; 20 mobile gutter |
| Controls | 40 desktop; 44 mobile/coarse target; compact readable table rows |
| Spacing | 4/8/12/16/20/24/32; 8 between related toolbar controls |
| Radius | 8 controls; 12 cards; avoid oversized decorative containers |
| Icons | Shared 18 px stroke family; label accompanies non-obvious actions |

Forest, Indigo and Clay preview the same semantic token contract. A client changes approved brand tokens, logo and public school copy; every module consumes those tokens. Status colors and hierarchy remain stable. Validate each real client’s contrast and logo assets. Never inject arbitrary tenant CSS or use palette values as permission logic.

## Shared compositions

- `WorkspaceShell`: icon navigation, labelled active state, scrollable middle, user identity, separate Sign out. Mobile menu returns focus to its trigger; no horizontal document overflow.
- `PageHeader`: title and purpose together; related controls aligned within a clear action group. Refresh belongs to the date/query control, never concatenated with a settings label.
- `AttributeSearchToolbar`: compact default attribute, input, Filters and Sort across the content width. Enter applies a trimmed search. Selecting the attribute does not highlight the full group. Keep a visible keyboard focus indicator on the focused control even before typing; input emphasis and focus accessibility are different concerns.
- `FilterDrawer`: no decorative boxes around attributes. Collapsible attribute headings, dividing lines, unselected multiselect options, selections stay visible and do not close the drawer. OR within an attribute, AND across attributes. Cancel discards the pending draft; Apply commits it. Exactly Cancel and Apply in the footer. Applied chips with removal live outside the drawer.
- `SortDrawer`: Sort by / Order by radio groups, initially expanded and collapsible, Cancel / Apply. A stable ID breaks ties. No redundant sort label standing in for the component.
- `DataTable / MobileRecordList`: semantic caption and headers; explicit accessible detail links; content-sized actions column; no mouse-only row action or redundant Actions button/ellipsis. Dense editing tables may use a labelled horizontal region only when necessary, with a readable small-screen alternative.
- `StepFlow`: Back left, Continue right; Save draft and leave below, enabled only after real input changes. Required errors next to fields plus summary/focus. No empty draft creation. Attendance uses its own in-memory intent contract and does not expose Save draft.
- `ConfirmDialog / Drawer`: useful title/description, deliberate initial focus, Escape/Cancel, focus containment and return, scrollable body, reachable footer at 200% zoom. Do not rely on a static PNG to establish accessibility.
- `OutcomeReceipt`: actual action, scope, time, state, reference and next action. Unknown, saved, submitted, returned, approved and published are not interchangeable labels.

## Teacher-specific compositions

`TeachingDaySessionCard` displays the school-local date/time, subject, class, roster count and true session state. Submitted sessions lead to a receipt; scheduled/open sessions lead to the register. Empty assignments explain who can resolve them. Counts are teacher-scoped and describe exactly what they count.

`AttendanceRegister` groups each pupil’s status as a labelled radio group. Nothing is selected on open. Present, Absent, Late and Excused remain text-labelled, not color-only. Bulk present is deliberate, states its affected scope and preserves existing exceptions. Search/filter never narrows the submission validation set. Keep unmarked count and the next unmarked action visible.

`SubmissionReview` shows the exact session and full-roster totals, followed by a single final command. A pending result locks that intent. Status lookup precedes retry; reuse the same idempotency key and unchanged payload. Acknowledged registers are read-only. Permission loss clears protected data; stale version requires explicit reconciliation.

`ResponseAndFeedback` separates learner content from private teacher feedback. Save private draft does not return feedback. Return shows a confirmation and visible publication state.

`Gradebook` labels outcome and mark independently: Not entered, Scored, Absent, Exempt. Zero is a valid score. Incomplete outcomes block moderation submission. Read-only moderated/published versions do not silently reopen.

`PurposeScopedFamilyThread` names the pupil and authorized relationship context without exposing private family restrictions. Delivery failures do not show a sent tick.

## State and content quality

Each route needs loading, empty, recoverable error, permission denied, session expiry and relevant concurrency/unknown states. Keep exact verbs: Open register, Review submission, Submit attendance, Check submission status, Save private draft, Review and return, Send for moderation. Avoid generic Success with no evidence, technical guard names in user copy, excessive KPI cards and unnecessary category headings.

Use semantic HTML, labels, keyboard controls and live status announcements. Validate zoom, focus, contrast, native screen readers and touch use on the integrated product. This pack makes no conformance claim.
