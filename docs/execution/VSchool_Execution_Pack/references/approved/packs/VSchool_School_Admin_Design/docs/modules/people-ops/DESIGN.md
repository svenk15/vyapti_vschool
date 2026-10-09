# People operations — School Administrator design

Edition 01 · Owner mapping: people-operations · UX proposal; human review pending.

Coordinate leave and staffing without exposing restricted pay data.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-53"></a>
## SA-53 — Review leave and staffing coverage

**Phase:** 6 · **Authority:** leave.approve (delegated)

**Entry:** the People operations workspace or its linked record. Prototype: `#/flow/SA-53`.

**Prerequisites:** SA-13, leave ledger / coverage design.

### Step 1 — Leave request

Show dates and staffing impact; keep sensitive attachments restricted.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Request (`request`) | select | Yes | Rohan Das · 12–13 Oct |
| Decision (`decision`) | select | Yes | Approve, Request information, Decline |

### Step 2 — Coverage

Coordinate cover through Timetable; no attendance auto-edit.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Coverage plan and response (`coverage`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The leave balance and coverage decisions are recorded separately.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Pupil attendance and staff attendance are different domains; serialize concurrent leave debits.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Insufficient balance or changed approver authority blocks approval.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

People operations owns LeaveRequest/BalanceLedger; Academics owns cover; Employee identity read via People contract.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-54"></a>
## SA-54 — Review payroll inputs and hand off

**Phase:** 6 · **Authority:** payroll.input / payroll.approve (restricted)

**Entry:** the People operations workspace or its linked record. Prototype: `#/flow/SA-54`.

**Prerequisites:** SA-53, restricted payroll rules and review.

### Step 1 — Pay period

Only authorized payroll staff see salary figures.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Period (`period`) | select | Yes | October 2026 |
| Action (`action`) | select | Yes | Review input completeness, Handoff to payroll approver |

### Step 2 — Approval evidence

Use jurisdiction-specific versioned rules.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Approved payroll review reference (`reference`) | text | Yes | No prefilled user content |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

Authorized payroll review proceeds with immutable approved run history.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

A School Administrator role grants no salary access; no payroll formula is assumed in this design.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Rule change, missing input or revoked approval stops the run; corrections create a new linked revision.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Restricted PayrollRun, rule version and input references; immutable approval/export evidence. Separate regulatory design required.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
