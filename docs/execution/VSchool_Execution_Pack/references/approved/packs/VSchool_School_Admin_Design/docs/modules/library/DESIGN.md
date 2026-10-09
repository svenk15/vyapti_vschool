# Library — School Administrator design

Edition 01 · Owner mapping: library · UX proposal; human review pending.

Manage catalog, circulation and overdue work.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-55"></a>
## SA-55 — Catalog and circulate library items

**Phase:** 6 · **Authority:** library.circulate (delegated)

**Entry:** the Library workspace or its linked record. Prototype: `#/flow/SA-55`.

**Prerequisites:** SA-18, physical copy / hold policy design.

### Step 1 — Identify the copy

Barcode identifies a physical copy, not only the title.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Copy barcode (`barcode`) | text | Yes | No prefilled user content |
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |

### Step 2 — Circulation

Check eligibility and active hold policy.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Action (`action`) | select | Yes | Check out, Return, Renew, Reserve |

### Confirm and outcome

The loan or reservation is recorded with a clear due date.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Only one active loan per physical copy; fines are optional Finance integration.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Already loaned, hold queue conflict, lost item and duplicate scan have explicit outcomes.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

CatalogItem, PhysicalCopy, Loan, Reservation and versioned policy. Lock copy/hold state in circulation transaction.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-56"></a>
## SA-56 — Resolve overdue, lost or inventory discrepancies

**Phase:** 6 · **Authority:** library.manage (delegated)

**Entry:** the Library workspace or its linked record. Prototype: `#/flow/SA-56`.

**Prerequisites:** SA-55.

### Step 1 — Exception

Review loan and item history.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Case (`case`) | select | Yes | Overdue copy, Reported lost, Inventory discrepancy |

### Step 2 — Disposition

Use a reasoned adjustment rather than deleting history.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Decision (`decision`) | select | Yes | Extend with approval, Record loss, Reconcile return |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

The item and borrower record show the reasoned outcome.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Loss/recovery preserves circulation history; no automatic guardian billing without the Finance contract.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Concurrent return and loss adjustment reconcile under the copy guard.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

PhysicalCopy state, Loan closure/revision, inventory evidence and optional FineCharge event.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
