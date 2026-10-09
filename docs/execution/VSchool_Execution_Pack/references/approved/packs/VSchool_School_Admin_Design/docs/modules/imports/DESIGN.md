# Imports — School Administrator design

Edition 01 · Owner mapping: imports, students · UX proposal; human review pending.

Preview, confirm and reconcile roster imports.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-23"></a>
## SA-23 — Preview a roster import

**Phase:** 1 · **Authority:** import.upload · school administrator only

**Entry:** the Imports workspace or its linked record. Prototype: `#/flow/SA-23`.

**Prerequisites:** SA-19, import schema and upload contract.

### Step 1 — Target and template

Context is supplied separately from STUDENT_ROSTER_V1 rows.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Academic year (`year`) | select | Yes | 2026–27 |
| Source namespace (`namespace`) | text | Yes | school-sis |
| Placement effective from (`effective`) | date | Yes | No prefilled user content |

### Step 2 — Choose file

UTF-8 CSV; production limits and per-request chunk bounds follow the Imports LLD.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| CSV file (`file`) | file | Yes | No prefilled user content |

### Step 3 — Review preview

Inspect creates, no-change rows, conflicts and errors before confirming.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have reviewed the synthetic preview: 3 creates, 1 unchanged, 1 error. (`preview`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A preview is available; no student records are written.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No guardian columns in the Phase 1 roster contract; no raw rows, file bytes or hashes in audit.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Invalid encoding/header/size fails clearly; schema error gives the correct template; no silent truncation.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Imports owns immutable source hash in ImportJob, versioned preview and bounded rows. Preview reads authorized academic/student facts only.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-24"></a>
## SA-24 — Confirm, resume and reconcile an import

**Phase:** 1 · **Authority:** import.upload

**Entry:** the Imports workspace or its linked record. Prototype: `#/flow/SA-24`.

**Prerequisites:** SA-23.

### Step 1 — Confirm preview

Confirmation pins source hash, context, preview revision and referenced versions.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Import (`job`) | select | Yes | IMP-1042 · 5 rows |

### Step 2 — Review partial results

Successful rows stay committed; failed rows keep their row number and reason.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Action (`action`) | select | Yes | Confirm valid preview, Resume unprocessed rows, Download redacted error report |

### Confirm and outcome

Each row reports created, unchanged, failed or remaining with durable receipts.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Create-only plus exact no-change re-import in Phase 1; corrections and transfers use explicit workflows.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Stale previews require re-preview; lost responses query receipts before retry; avoid replaying successes.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Per-row transaction: Person, Student, Enrollment/Placement, external mapping, row receipt, audit and outbox. Bounded batch processing, no assumed worker.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
