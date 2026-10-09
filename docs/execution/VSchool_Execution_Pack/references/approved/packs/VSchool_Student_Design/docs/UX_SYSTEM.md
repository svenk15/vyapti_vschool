# Shared UX and student compositions
Use the existing shared system. Do not create a student-only component fork.

| Foundation | Rule |
|---|---|
| Background / surface | #F7F8F4 / white |
| Text / secondary | #213A32 / #596C61 |
| Brand / soft / deep | #225B49 / #E9F2EC / #153E31 |
| Layout | 240 desktop sidebar, 60 topbar, 32 desktop gutter, 20 mobile gutter |
| Type | 28 title, 18 section, 14 body, 13 navigation, 12 metadata, 11 uppercase groups |
| Controls | 40 desktop, 44 touch; consistent 18 stroke icons |
| Spacing | 4/8/12/16/20/24/32; 8 between related toolbar controls |
| Radius | 8 controls, 12 cards |
| Palette | Forest, Indigo, Clay use shared brand tokens; status meaning remains stable |

Nimbus Sans is bundled for consistent review rendering with its license. Integrate the actual product's shared font and tokens, not an unrelated new type system.

## Shell and navigation
Identity sits at the bottom of desktop navigation. Sign out has its own separated action area. Icons support labels. Mobile has a compact header, menu and four core shortcuts filtered by capability. The school ribbon binds learner, class, school and branch together; switching school never keeps another enrollment's records onscreen.

States include loading, empty, unavailable, session expiry and missing module. Active state has text/shape, not color alone. Breadcrumbs reflect actual hierarchy; peer destinations are not nested arbitrarily.

## My day
Show a small prioritized action list, next class with explicit room/time changes, and published school notices. The primary content is actionable, not a wall of KPI cards. A future home projection must bound results and declare refresh time. Handle no classes, no work due, feedback unavailable and school holiday without invented assignments.

## Search, filters and sort
Attribute search defaults to Assignment name. Enter applies; no visible Search button. The dropdown has a compact width and does not highlight the whole group. Keep keyboard focus visible on the actual focused control.

Search, Filters and Sort fill the table toolbar. Filters open a side panel with plain expandable headings, dividing lines and persistent multiselect options; no selected defaults. OR within an attribute, AND across attributes. Cancel discards pending choices; Apply commits. Applied chips are removable outside. Sort is a separate side panel with expanded Sort by and Order by radio groups. Stable ID breaks ties. Exactly Cancel and Apply appear in these footers.

## Assignment detail and editor
Separate instructions from the workspace. Show due time with school timezone, effective extension, late rule, response/file constraints, published criteria and resource metadata. A draft has Unsaved changes / Draft saved / Could not save states. Only an acknowledged server save earns Saved in production.

The editor has a readable writing area; the file panel distinguishes uploading, checking, ready, blocked and failed. Upload completion is not submission. Review shows exact answer, ready files, policy version and deadline. Back stays separate from the primary action; Save draft and leave is below and enabled only for meaningful changed content. No prechecked consent or automatic submission.

The receipt names exact attempt, accepted time, late status and immutable evidence. Unknown outcomes offer Check submission status before another intent. Avoid celebratory copy implying a grade.

## Feedback and revision
Show the exact returned attempt, student-facing comments and published criteria. Feedback can return without allowing another submission. When revision is permitted, create a new draft and preserve prior attempts. Exempt, Absent, Not assessed and numeric zero remain distinct. No synthetic average or rank without an approved calculation contract.

## Responsive and accessible behavior
Tables use captions/headers and readable mobile records. Explicit View/Open actions remain keyboard accessible. Dialogs have names, deliberate initial focus, Tab/Shift+Tab containment, Escape and focus return. Errors preserve input, announce themselves and identify recovery. Colors have text/icon support.

Test at 360px and 390px, with long names, translated strings, keyboard only, native 200% zoom, reduced motion and supported screen readers. Chromium checks do not establish WCAG conformance. Native VoiceOver/NVDA and zoom remain pending.
