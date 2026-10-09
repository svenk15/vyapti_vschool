# Daily & weekly review — DESIGN

Owner: Leadership read projections. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-05 — Review my school today
**Delivery:** phase 1 · First release
**Trigger:** Start of day or return to the workspace.
**Actors:** Principal
**Preconditions:** Branch-scoped source projections are authorized; school date/time and data freshness known.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | System | Show branch, school-local date and last successful refresh. | No ambiguous institution-wide totals. |
| 2 | Principal | Review a short prioritized list. | Registers due, uncovered sessions and assigned decisions appear only when those modules exist. |
| 3 | Principal | Open one item. | Filters, cutoff, source records and permitted action carry through. |
| 4 | System | Refresh after a source change. | Resolved items update without pretending every related follow-up is closed. |

**Inputs and validation**

- **Date:** Defaults to school today; historical dates explicit.
- **Priority:** Operational deadline/severity rule, never a pupil or teacher risk score.

**Outcome:** One clear next action grounded in evidence.
**Authorization:** Home projection inherits each source capability; aggregated cards do not create drill-down authority.
**Data read:** Authorized session/decision/follow-up projections and as-of metadata.
**Data written:** None.

**Alternate and failure paths**

- No items: show No action required for this scope, plus data cutoff.
- Missing module: omit its widget; do not show zero or an upsell.

**Demo acceptance:** Every number has a definition and opens the same scoped record set.


## LEA-06 — Recognize stale, incomplete or unavailable information
**Delivery:** phase 1 · First release
**Trigger:** An owner service cannot refresh or some records are not yet submitted.
**Actors:** Principal; source projection
**Preconditions:** Freshness and completeness are available as separate metadata.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | System | Label source cutoff and current refresh outcome. | Last known data is visibly stale; unavailable is not zero. |
| 2 | Principal | Inspect what is missing. | Show source/type/count only within authority. |
| 3 | Principal | Retry or open a safe source view. | Retry uses current scope; input/filter state is retained. |
| 4 | System | Reconcile after recovery. | New cutoff/version is visible; pending decisions need fresh evidence. |

**Inputs and validation**

- **Cutoff:** Server-generated instant with school timezone.
- **Completeness:** Due/received/unknown counts, never a vague confidence score.

**Outcome:** Leader can judge whether information supports a decision.
**Authorization:** Do not expose withheld cases through error counts or hidden-widget totals.
**Data read:** Owner projection watermark; source availability; exact metric definition.
**Data written:** None apart from bounded refresh telemetry.

**Alternate and failure paths**

- Partial source failure: show available sections with explicit gaps.
- Stale evidence for mutation: block and re-review before decision.

**Demo acceptance:** Unavailable source does not appear as 0; approval cannot consume stale expected version.


## LEA-07 — Run the weekly leadership review
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Scheduled school review meeting.
**Actors:** Principal; authorized coordinators
**Preconditions:** Approved meeting purpose and source access; follow-up coordination enabled for actions.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose period and permitted scope. | Brief shows coverage, outstanding actions and relevant published changes. |
| 2 | Group | Inspect a concern and agree an action. | Owner, due time, source reference and completion evidence are explicit. |
| 3 | Principal | Confirm action list. | Each action is routed to its owning team; recipients are previewed. |
| 4 | Principal | Review carried-over actions next week. | Reassignment and verified outcomes remain traceable. |

**Inputs and validation**

- **Period:** Explicit start/end and school timezone.
- **Action owner:** Current eligible staff identity.
- **Due time:** School-local input converted to an instant.
- **Completion evidence:** Source-state condition or permitted attachment reference.

**Outcome:** Actionable review brief and owned follow-ups.
**Authorization:** A meeting participant does not gain the principal’s source privileges.
**Data read:** Approved report snapshots and follow-up history.
**Data written:** Internal follow-up records and approved meeting action references only.

**Alternate and failure paths**

- No reliable comparison period: omit trend claim.
- Action falls outside participants’ authority: hand off instead of exposing private records.

**Demo acceptance:** Next review distinguishes open, overdue, evidence-ready and verified closed actions.
