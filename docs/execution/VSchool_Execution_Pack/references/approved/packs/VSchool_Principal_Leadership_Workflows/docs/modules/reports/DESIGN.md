# Reports & accountability — DESIGN

Owner: Reporting + source owners. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-39 — Drill into a metric and export permitted evidence
**Delivery:** phase 1 · Later · Explicit scope extension
**Trigger:** Leader needs to explain a number or share an authorized report.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Versioned metric definition, bounded query and distinct export permission.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open a metric. | Carry filters, cutoff, denominator and scope into the evidence list. |
| 2 | Principal | Inspect records and exceptions. | Explain what was excluded and what is unavailable. |
| 3 | Principal | Preview export fields and scope. | Minimize personal data; rows are not broadened beyond the reviewed query. |
| 4 | System / owner | Generate and download via authorized route. | Report records definition/version/as-of; link expires and access is rechecked. |

**Inputs and validation**

- **Metric/period:** Exact definition/version and cutoff.
- **Columns:** Allowlisted for purpose.
- **Export format:** Owner-supported CSV/PDF; safe spreadsheet-cell handling.

**Outcome:** Explainable report and controlled evidence export.
**Authorization:** Aggregate access does not imply pupil-level rows or unrestricted bulk export.
**Data read:** Authorized metric projection/source records, snapshot metadata.
**Data written:** Report job/download audit; no source-record mutation.

**Alternate and failure paths**

- Large export: bounded asynchronous job with explicit readiness, reauthorization and expiry if supported.
- Suppressed small groups must not be reconstructible via totals or overlapping filter exports.

**Demo acceptance:** Report total agrees with the same scoped evidence snapshot.


## LEA-40 — Compare branches responsibly
**Delivery:** phase 2 · Later
**Trigger:** Institution leader has explicit cross-branch analytics authority.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Comparable definitions, time basis, granted branch set and suppression rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select authorized branches and period. | No implicit all-institution scope. |
| 2 | Principal | Review comparability. | Show module availability, calendar, coverage and definition differences. |
| 3 | Principal | Compare like-for-like metrics. | Display counts/denominators; no misleading simple average of percentages. |
| 4 | System / owner | Open a branch only where detailed authority exists. | A summary grant does not create full operational access. |

**Inputs and validation**

- **Branch set:** Explicit allowed set.
- **Metric:** Compatible definition version.
- **Comparison window:** Normalized school-day/period policy, visibly documented.

**Outcome:** Qualified comparison with limitations visible.
**Authorization:** Cross-branch analytics, branch detail and pupil evidence are separate capabilities.
**Data read:** Authorized aggregate snapshots and definition metadata.
**Data written:** None, unless an explicitly authorized report export is requested.

**Alternate and failure paths**

- Different calendars or missing data: show Not comparable rather than rank.
- Partial branch grant loss: recompute safely without revealing withheld totals.

**Demo acceptance:** Weighted total uses underlying counts; unavailable branch is never treated as zero.


## LEA-41 — Prepare a leadership review brief
**Delivery:** phase 2 · Later
**Trigger:** Leader needs an evidence-backed meeting or management summary.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Approved audience and access-filtered report sources.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose period, purpose and audience. | Only permitted source sections included. |
| 2 | Principal | Review key changes and unresolved actions. | Every claim links to a source/cutoff; distinguish fact from interpretation. |
| 3 | Principal | Edit and approve the narrative. | Exclude confidential cases and unsupported causal claims. |
| 4 | System / owner | Export or share only through authorized action. | Audience preview and delivery/receipt remain explicit. |

**Inputs and validation**

- **Audience:** Approved role/person set.
- **Narrative:** Human reviewed; no student/teacher labels unsupported by evidence.
- **Source versions:** Retained in report metadata.

**Outcome:** Reviewable brief with evidence and next actions.
**Authorization:** Brief generation and external sharing are separate grants.
**Data read:** Source metric snapshots; action status; publication-safe narrative.
**Data written:** Report draft/version; approved sharing command only on explicit confirmation.

**Alternate and failure paths**

- Missing baseline: no invented trend.
- A restricted source cannot be exposed through an apparently harmless summary.

**Demo acceptance:** Reviewer can trace each number to the same permitted snapshot.


## LEA-42 — Review decision and follow-up history
**Delivery:** phase 2 · Later
**Trigger:** Leader audits why an action was taken or a case remains open.
**Actors:** Principal; authorized Reporting + source owners owner
**Preconditions:** Purpose-specific audit/event-read grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Search by reference, actor or bounded date. | Only visible scopes and safe event metadata returned. |
| 2 | Principal | Open event sequence. | Show intent, owner result, version and who acted. |
| 3 | Principal | Inspect linked source only with current permission. | Audit reference does not bypass access. |
| 4 | System / owner | Record a review finding or escalation if needed. | Prior audit events remain append-only. |

**Inputs and validation**

- **Search attribute:** Reference by default; actor/date allowlisted.
- **Window:** Bounded; no all-time unrestricted dump.
- **Finding:** Separate review record.

**Outcome:** Understandable accountability trail.
**Authorization:** General audit excludes raw messages, answers, health detail, tokens and file contents.
**Data read:** Append-only safe events; command/decision references.
**Data written:** Optional review finding, never audit rewrite.

**Alternate and failure paths**

- Actor later inactive: historical attribution retained safely.
- Source unavailable/restricted: audit shows safe reference, not leaked contents.

**Demo acceptance:** Closed/reopened/reassigned history cannot be overwritten to erase responsibility.
