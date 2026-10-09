# Health & safeguarding — School Administrator design

Edition 01 · Owner mapping: health, safeguarding · UX proposal; human review pending.

Route concerns to authorized specialists with minimal disclosure.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-59"></a>
## SA-59 — Refer a health or safeguarding concern

**Phase:** 6 · **Authority:** restricted referral.create; case read requires explicit specialist grant

**Entry:** the Health & safeguarding workspace or its linked record. Prototype: `#/flow/SA-59`.

**Prerequisites:** restricted referral and escalation design.

### Step 1 — Minimal referral

Avoid sensitive details in shared dashboards and notifications.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Urgency (`urgency`) | select | Yes | Routine specialist review, Urgent: follow approved school emergency protocol |

### Step 2 — Restricted handoff

This review prototype stores no clinical narrative.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Restricted handoff reference (`reference`) | text | Yes | No prefilled user content |
| Authorized team (`team`) | select | Yes | School health lead, Safeguarding lead |

### Confirm and outcome

An authorized specialist receives a minimal referral; general admins see only permitted handoff status.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No diagnosis or clinical advice in the general school workspace; emergency action follows the approved local protocol.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

If the recipient lacks authority, route privately to the approved escalation contact; never broadcast.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Restricted referral and purpose grant; HealthProfile/Visit/Incident remain specialist-owned and separately access controlled.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-60"></a>
## SA-60 — Review emergency access and restricted case handling

**Phase:** 6 · **Authority:** health.break_glass / safeguarding.review (restricted)

**Entry:** the Health & safeguarding workspace or its linked record. Prototype: `#/flow/SA-60`.

**Prerequisites:** SA-59, emergency authority and independent review.

### Step 1 — Exceptional access

Available only to explicitly authorized emergency roles.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Restricted case reference (`case`) | text | Yes | No prefilled user content |
| Emergency access justification (`justification`) | textarea | Yes | No prefilled user content |

### Step 2 — Accountable review

Access is time bounded and independently reviewed.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| The approved emergency access procedure applies. (`ack`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

Authorized emergency access has an expiry, audit and independent review.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No blanket administrator access; this workflow requires a separate sensitive-data design and deployment approval.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Denied or expired emergency authority must not reveal case contents.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

RestrictedNoteGrant/break-glass event and specialist record access audit; no details in general activity.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
