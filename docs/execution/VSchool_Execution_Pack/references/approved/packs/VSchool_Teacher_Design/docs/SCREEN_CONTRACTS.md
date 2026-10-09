# Screen contracts and state ownership

| Route / entry | Primary purpose | Required state contracts |
|---|---|---|
| `/sign-in/<published-school-slug>` | Recognizable school entry | Published brand only; generic credential errors; verified recovery policy; no private configuration |
| Teacher day | Dated assigned sessions | Loading / no sessions / missing readiness / stale assignment / permitted list; branch-local date |
| Assigned class | Minimal roster | Current assignment and date scope; empty roster; permission lost; no global pupil search |
| Session register | Explicit mark and submit | Scheduled → opened/frozen → in-memory draft → review → pending/unknown → acknowledged; conflict and denial |
| Submitted session / history | Receipt and read-only record | Stable reference; versioned correction history if permitted; safe administrator handoff |
| My account | Own access and branch context | Active/expired session; authorized branch list; dirty/unknown intent handling |
| Messages / thread | Permitted notices and conversations | Audience revoked, acknowledgement, private draft, approval pending, per-recipient delivery state |
| Timetable / cover | Published schedule and explicit cover | Version/dates/timezone; changed/cancelled occurrence; no automatic attendance inference |
| Learning / assignment | Published task and submissions | Draft/published/withdrawn; submitted/late/missing; versioned feedback private/returned |
| Assessment / gradebook | Mark outcomes | Not entered / Scored / Absent / Exempt; draft / awaiting moderation / returned / approved / published |
| Service request | Narrow self/assignment purpose | Draft/requested/owner decision/withdrawn; no implied case access or allocation approval |
| Teaching assistant | Reviewed evidence-based draft | Authorized sources, unsupported answer, unavailable provider, review, explicit owner command |

Prototype hash routes are review navigation, not a prescribed production URL migration. Production route names must match the actual application conventions and safe return-URL contract.

Every flow’s exact fields, step sequence, outcome, failure handling and logical database owner appear in `../workflow-catalog.json` and its module DESIGN.md. The generic flow simulator records a fictional review receipt; it does not implement every future domain state machine.

## Prototype interaction depth

The attendance register, branch separation, uncertain submission recovery, private feedback return and marks/moderation checks have connected in-memory models. Every catalog journey has step forms, required-field checks and a review receipt. Later service workflows illustrate the task and handoff; their receipts do not simulate the full downstream approver, provider, file store or database. Some generic fields require richer production pickers and domain validation. Do not copy the review scenario controls or fictional fixture IDs into production.

## Return and navigation

Use explicit breadcrumbs only for actual parent/detail relationships. Top-level teacher areas remain siblings. Entered form data survives validation errors; changing branch or signing out warns about unsaved input, and unknown attendance intent must be resolved before discarding it. Expiry/revocation clears protected data. A browser refresh currently resets all prototype data by design.
