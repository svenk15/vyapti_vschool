# Production page recipes

Updated: 19 October 2026 (Asia/Kolkata)

These recipes extend the existing shared VSchool components. They define presentation only: owner authorization, server queries, commands, versions, receipts and failure semantics remain authoritative. An exact approved production screen overrides a general recipe. Where the pack supplies only a workflow explorer, the resulting production composition is a **design extension pending human review**.

All recipes use `PageHeader`, shared semantic tokens, local Inter, 24px section gaps, 12px bordered surfaces, 40px desktop controls, 44px mobile targets and visible two-pixel focus. At 1200px and above, content uses the specified grid; below 1200px it may stack. Mobile content is linearized in reading and keyboard order rather than squeezed into desktop columns.

## Workspace dashboard

Order: branch/person context supplied by the shell → page title/date → optional concise scope warning → authoritative summary → primary work → quick access/help. Use `workspace-dashboard`, `workspace-dashboard-grid`, `dashboard-summary-strip`, `workspace-dashboard-actions` and `workspace-action-list`. The primary column is `minmax(0,2fr)` and the secondary column is at least 300px with a 24px gap. Summary metrics share one content-height surface. Empty projections occupy one purposeful surface; do not add empty cards to balance the grid. Primary actions belong in `PageHeader`; one concise action appears per task row. Loading, unavailable and permission states retain the same heading and replace only the affected projection. Focus follows header actions, primary work, then secondary links.

Current consumers: `/admin`, `/teacher/today` (specialized teaching-day variant), `/family`, `/student`, `/leadership`. The Administrator page is the exact composition authority. Teacher keeps its approved session-first task workspace. Parent and Student use their exact child/self context. Principal is a pattern extension because its reference is a workflow explorer.

## Searchable directory

Order: page header and primary create action → optional tabs → committed search toolbar → applied-filter summary → bounded server result surface → pagination. Use the shared controlled toolbar, `ServerTable`, filter drawer and sort drawer. Search attributes, filters and ordering are server-supported allowlists stored in the URL; Back/Forward restores committed state. Desktop tables use 40px headers and at least 56px rows. Mobile uses labelled rows/cards when horizontal comparison is unnecessary; otherwise retain a focusable bounded scroller. Loading, initial empty, no matches, partial failure, permission loss and stale cursor are distinct. Opening and closing a drawer returns focus to its trigger.

Representative: `/admin/students`. Matching consumers include staff, classes, imports, Attendance directories, notices, Learning lists, results and Principal queues only where their owner query supports the displayed controls.

## Record detail

Order: breadcrumb/back path → title, status and permitted actions → identity/summary facts → domain sections → immutable history → contextual return path. Use a readable primary column with an optional 300–320px action/status rail. Do not duplicate the shell context in every card. Destructive or state-changing actions use a guarded dialog or staged owner flow. Missing, revoked and unavailable reads disclose no cached protected data. Mobile places status before actions and history after current facts.

Representative: `/admin/students/[id]`. Matching consumers include session, notice, assignment, request, result and Principal owner-detail routes.

## Staged form

Order: page header → `Stepper` → stage heading → fields → stage-specific validation → Back/Continue → final consequence → confirmed owner command → receipt. Content is at most 760px plus an optional 320px support panel with a 24px gap. Back/Continue retains permitted in-memory values. Persistence happens only at the documented owner boundary. Unknown results retain the original command key and expose status/retry actions; stale state compares current and attempted values. Durable Save draft appears only when the owner contract implements it. Stage changes focus the stage heading.

Representative: Student registration and Attendance correction. Matching consumers include enrollment, transfer, notice/event composition, invitations and owner request flows.

## Review and confirmation

Order: source identity and version → entered changes → consequences → conflict/separation notice → Back → one final confirmation. Review reads current owner evidence and never grants source authority. Changed evidence returns to review; unknown confirmation cannot start a second command. Destructive actions use explicit labels and danger semantics only where the action itself is destructive.

Representative: Attendance correction review and Principal decision review.

## Receipt and history

Order: outcome/status → stable reference → effective facts → replay/recovery state → next safe action → chronological immutable history. Success appears only after the owner confirms commitment. Unknown remains warning, not failure or success. Protected replay is reauthorized. Desktop facts may use a two-column definition list; mobile uses one column. Focus moves to the outcome heading after confirmation.

Representative: Student registration receipt, Attendance submission/correction receipt and owner decision receipts.

## Settings form

Order: page header and refresh action → one clearly named section → constrained form (680–720px) → preview where required → Save/Cancel aligned below fields → related secondary sections. Persisted and preview values are visibly distinct. Validation stays beside its field; stale saves preserve attempted safe values. Mobile actions become full-width only when it improves reachability.

Representative: `/admin/school` and Appearance settings.

## Inbox or request queue

Order: page header → bounded filters/sort → count/source cutoff → queue table/cards → one current action per item. Assignment or inbox presence is never source authority. State, due time, owner and safe source reference remain separate cells. Empty and unavailable states explain whether there is no work or the owner projection cannot be read.

Representative: Principal decision and Coordination queues.

## Timetable

Order: page header → school-local week/date controls → authoritative publication/context note → desktop schedule grid plus keyboard-operable list alternative → mobile day selector and lesson list → legend. Breaks, unassigned periods, cover and cancellation use explicit text as well as colour. Never infer a five-day pattern, room or Teacher access. Date/context changes clear previous scoped results.

Representative: Administrator, Teacher, Parent and Student timetable routes. This remains specialized and does not inherit generic directory table behavior.

## Attendance or assessment entry

Order: immutable session/cycle context → recovery/status notice → bounded roster/evidence → entry controls → live totals → review → confirmation → receipt/history. Every pupil/result remains keyboard reachable. Mobile uses labelled records rather than a compressed grid. Frozen rosters, expected versions, mark validation and final submission boundaries remain owner behavior. A lost response preserves the original key and entered permitted values.

Representative: Teacher Attendance register and Teacher assessment marking.

## Public sign-in

Order: published school identity when resolved → concise sign-in heading → fields → primary sign-in → recovery/setup links → generic failure. Generic routes use Forest. School-specific routes use only immutable published branding; drafts and previews never become public authority. Responses do not enumerate accounts or schools. Passwords and invitation tokens are never retained in browser storage. Mobile preserves 16px editable text and 44px targets.

Representative: `/sign-in` and `/sign-in/[school]`.

## Required state evidence

Each migrated workflow records the states it actually supports: entry/selection, data entry, retained Back/Continue values, review, final confirmation, receipt, validation, stale data, unknown recovery, revoked/unavailable access, history and return navigation. A state absent from the implemented owner contract is classified as deferred or contract-blocked, not silently mocked. Functional verification, visual comparison, human acceptance and production readiness remain separate.
