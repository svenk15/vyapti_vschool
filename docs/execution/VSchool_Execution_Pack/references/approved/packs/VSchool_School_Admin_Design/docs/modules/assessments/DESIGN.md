# Assessments — School Administrator design

Edition 01 · Owner mapping: assessments · UX proposal; human review pending.

Coordinate assessment readiness, approval and publication.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-46"></a>
## SA-46 — Coordinate assessment setup and marks readiness

**Phase:** 4 · **Authority:** assessment.coordinate

**Entry:** the Assessments workspace or its linked record. Prototype: `#/flow/SA-46`.

**Prerequisites:** SA-11, assessment scheme LLD.

### Step 1 — Assessment plan

Choose versioned grading and rounding rules.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Assessment (`assessment`) | select | Yes | Term 1 · 2026–27 |
| Class (`section`) | select | Yes | Grade 6 · A, Grade 6 · B, Grade 7 · A |
| Scheme (`scheme`) | select | Yes | Approved term scheme |

### Step 2 — Readiness

Review missing marks, absent and exempt states independently.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Next action (`action`) | select | Yes | Open readiness list, Request teacher completion, Send for moderation |

### Confirm and outcome

The assessment moves only when its defined prerequisites are met.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

School coordination does not imply permission to edit teachers’ marks.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Not-entered, absent and exempt are separate; no automatic numeric zero.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Assessment scheme/version and read model of MarkRevision/Moderation; owner use cases enforce role-specific actions.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-47"></a>
## SA-47 — Approve, publish or correct results

**Phase:** 4 · **Authority:** assessment.approve / results.publish (explicit)

**Entry:** the Assessments workspace or its linked record. Prototype: `#/flow/SA-47`.

**Prerequisites:** SA-46, publication concurrency design.

### Step 1 — Review approved revision

Publication pins exact mark and approval revisions.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Publication (`publication`) | select | Yes | Grade 6 · Term 1 |
| Action (`action`) | select | Yes | Review publication, Publish approved results, Correct a published result |

### Step 2 — Audience and confirmation

Only entitled, authorized family panels can receive the release.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reason (`reason`) | textarea | Yes | No prefilled user content |
| The approved content and audience have been reviewed. (`publish`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

Published results or a linked correction are available with a timestamp.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Draft edits never leak; approval and publication cannot race past changed marks.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Changed revision requires reapproval; partial delivery does not unpublish the valid result.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

ResultPublicationManifest references approved immutable MarkRevisions; Communication queues minimal notices.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
