# Assets & facilities — School Administrator design

Edition 01 · Owner mapping: inventory, facilities · UX proposal; human review pending.

Track custody, stock and facility availability.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-57"></a>
## SA-57 — Receive, issue or return stock and assets

**Phase:** 6 · **Authority:** inventory.manage (delegated)

**Entry:** the Assets & facilities workspace or its linked record. Prototype: `#/flow/SA-57`.

**Prerequisites:** stock and custody ledger LLD.

### Step 1 — Item and movement

Separate quantity stock from individually tracked assets.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Item / asset reference (`item`) | text | Yes | No prefilled user content |
| Movement (`movement`) | select | Yes | Receive, Issue, Return, Custody transfer |
| Quantity (`quantity`) | number | Yes | No prefilled user content |

### Step 2 — Custody evidence

Track who received it and why.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Authorized custodian (`custodian`) | text | Yes | No prefilled user content |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

An append-only movement and current custody state are available.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No negative stock unless explicitly approved by a versioned policy; cross-branch transfer requires both scopes.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Concurrent issue or missing custody acknowledgement leaves a reviewable exception.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Inventory StockMovement ledger and Asset/CustodyAssignment; owner transaction controls available stock.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-58"></a>
## SA-58 — Book a facility or request maintenance

**Phase:** 6 · **Authority:** facilities.manage (delegated)

**Entry:** the Assets & facilities workspace or its linked record. Prototype: `#/flow/SA-58`.

**Prerequisites:** room overlap and maintenance design.

### Step 1 — Facility

Choose an available resource and date.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Facility (`facility`) | select | Yes | Science lab, Assembly hall |
| Date (`date`) | date | Yes | No prefilled user content |
| Start time (`start`) | time | Yes | No prefilled user content |
| End time (`end`) | time | Yes | No prefilled user content |

### Step 2 — Purpose

A maintenance closure blocks conflicting use.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Request type (`type`) | select | Yes | Booking, Maintenance closure |
| Reason (`reason`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

A conflict-free booking or owned maintenance order is recorded.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Enforce overlapping reservation constraints and clear unavailable periods.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Concurrent booking or changed maintenance status shows alternatives instead of double-booking.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

FacilityBooking range constraint and MaintenanceOrder; published timetable room use checked through Academics contract.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
