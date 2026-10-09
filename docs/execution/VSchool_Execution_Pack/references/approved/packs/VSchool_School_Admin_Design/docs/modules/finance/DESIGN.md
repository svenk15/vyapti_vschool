# Fees & payments — School Administrator design

Edition 01 · Owner mapping: finance · UX proposal; human review pending.

Coordinate accountable billing through delegated finance authority.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-48"></a>
## SA-48 — Configure fees and concessions

**Phase:** 5 · **Authority:** finance.plan.manage / concession.approve (delegated)

**Entry:** the Fees & payments workspace or its linked record. Prototype: `#/flow/SA-48`.

**Prerequisites:** finance LLD + explicit approval authority.

### Step 1 — Plan scope

Finance is independent of Attendance.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Plan (`plan`) | select | Yes | 2026–27 annual tuition |
| Currency (`currency`) | select | Yes | INR |
| Amount in major units (`amount`) | number | Yes | No prefilled user content |

### Step 2 — Concession review

Approval authority is separate from requesting a concession.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Concession request / approval reference (`basis`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

An approved plan revision can be used to generate invoice snapshots.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

General school administrators have coordination access only unless explicitly granted finance authority.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

In-use fee plans version forward; negative/invalid money and unsupported currency are rejected.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Finance owns FeePlanVersion and Concession decision. Store money in exact minor units with currency; no floats.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-49"></a>
## SA-49 — Generate invoices and collect payment

**Phase:** 5 · **Authority:** finance.invoice / finance.collect (delegated)

**Entry:** the Fees & payments workspace or its linked record. Prototype: `#/flow/SA-49`.

**Prerequisites:** SA-48, payment verification / idempotency design.

### Step 1 — Invoice preview

Review payer, lines, currency and due date.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Due date (`due`) | date | Yes | No prefilled user content |
| Fee plan (`plan`) | select | Yes | Approved tuition plan |

### Step 2 — Collection

Show actual payment evidence and allocation.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Method (`method`) | select | Yes | Record verified bank transfer, Record cash with receipt authority, Hosted payment link |
| Payment reference (`reference`) | text | Yes | No prefilled user content |

### Confirm and outcome

Posted invoice, verified payment and receipt retain separate states.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

A browser success return is not proof of payment; callbacks authenticate and deduplicate.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Unknown outcomes are reconciled before retrying; partial payment leaves an explicit balance.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Finance Invoice/Line snapshots, Payment, Allocation and Receipt, with unique provider/reference constraints and audit.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-50"></a>
## SA-50 — Resolve reconciliation, adjustment or refund

**Phase:** 5 · **Authority:** finance.reconcile / refund.approve (delegated)

**Entry:** the Fees & payments workspace or its linked record. Prototype: `#/flow/SA-50`.

**Prerequisites:** SA-49, refund reservation and reconciliation design.

### Step 1 — Exception

Open the exact ledger and provider evidence.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Case (`case`) | select | Yes | Unmatched settlement, Credit adjustment, Refund request |

### Step 2 — Review approval

Posted history is immutable; refunds reserve available value.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Approval / settlement reference (`reference`) | text | Yes | No prefilled user content |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

An authorized adjustment or reconciled outcome appends to the ledger.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Do not edit posted amounts or double-refund an uncertain provider request.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Timeout, duplicate callback, insufficient refundable balance and rejected approval have explicit outcomes.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Finance CreditNote, RefundReservation, Settlement and append-only ledger entries; idempotent provider seam.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
