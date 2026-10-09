# Reports — School Administrator design

Edition 01 · Owner mapping: reporting · UX proposal; human review pending.

Understand complete, scoped and explainable operational data.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-30"></a>
## SA-30 — Review and export attendance

**Phase:** 1 · **Authority:** attendance.read_school + attendance.export

**Entry:** the Reports workspace or its linked record. Prototype: `#/flow/SA-30`.

**Prerequisites:** SA-26.

### Step 1 — Report scope

Start with one authorized branch and an explicit period.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| From date (`from`) | date | Yes | No prefilled user content |
| To date (`to`) | date | Yes | No prefilled user content |
| View (`view`) | select | Yes | Session completeness, Student attendance, Class summary |

### Step 2 — Review export

Show columns, row count, completeness and the data timestamp.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the scope and permitted columns. (`export`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A scoped report and bounded export match the underlying session records.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Rate = (Present + Late) / (Present + Late + Absent); Excused excluded. Zero denominator is unavailable.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Unsubmitted data remains missing; revoked access is rechecked at export generation/download.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Reporting joins scoped sessions, effective records, frozen roster and student identifiers; export reads only allowed columns.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-31"></a>
## SA-31 — Compare trends and assign follow-up

**Phase:** 2 · **Authority:** report.read + followup.manage (proposed)

**Entry:** the Reports workspace or its linked record. Prototype: `#/flow/SA-31`.

**Prerequisites:** SA-30, new follow-up LLD.

### Step 1 — Review the metric

Compare compatible periods with definition, denominator and freshness.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Metric (`metric`) | select | Yes | Submission completeness, Unexplained absence follow-up |
| From date (`from`) | date | Yes | No prefilled user content |
| To date (`to`) | date | Yes | No prefilled user content |

### Step 2 — Follow up

Create a purpose-limited action for an authorized colleague.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Owner (`owner`) | select | Yes | School office, Class teacher |
| Follow-up action (`action`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The concern has an owner, due date and source evidence.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Structured follow-up is a proposed extension, not claimed Phase 2 implementation; no punitive automated scoring.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Low sample sizes, partial data and changed permissions limit drilldowns.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Reporting read model; proposed FollowUpCase stores references and minimal notes, with separate module design before implementation.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
