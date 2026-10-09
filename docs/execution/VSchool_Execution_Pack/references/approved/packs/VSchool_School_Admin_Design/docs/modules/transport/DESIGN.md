# Transport — School Administrator design

Edition 01 · Owner mapping: transport · UX proposal; human review pending.

Coordinate safe routes, allocations and trip exceptions.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-51"></a>
## SA-51 — Prepare routes and allocate students

**Phase:** 6 · **Authority:** transport.manage (delegated)

**Entry:** the Transport workspace or its linked record. Prototype: `#/flow/SA-51`.

**Prerequisites:** SA-18, transport qualification / capacity design.

### Step 1 — Route and capacity

Use eligible vehicles and drivers.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Route (`route`) | select | Yes | Route 4 · Whitefield |
| Vehicle (`vehicle`) | select | Yes | Bus 12 · 40 seats |
| Verified driver reference (`driver`) | text | Yes | No prefilled user content |

### Step 2 — Student allocation

Confirm approved stop and handoff arrangements.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Student (`student`) | select | Yes | Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003 |
| Stop (`stop`) | text | Yes | No prefilled user content |
| Effective from (`from`) | date | Yes | No prefilled user content |

### Confirm and outcome

A dated allocation contributes to the next trip manifest.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Transport consent, pickup authority and guardian portal grant are separate.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Full vehicle, expired qualification or unavailable stop blocks the allocation.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Transport RouteVersion, Stop, Vehicle/DriverQualification, Allocation and trip manifest snapshot.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.

<a id="sa-52"></a>
## SA-52 — Resolve a trip or handoff exception

**Phase:** 6 · **Authority:** transport.trip.manage (delegated)

**Entry:** the Transport workspace or its linked record. Prototype: `#/flow/SA-52`.

**Prerequisites:** SA-51, handoff / offline contingency design.

### Step 1 — Trip event

Protect live child location and identity.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Trip (`trip`) | select | Yes | Route 4 · Afternoon |
| Exception (`event`) | select | Yes | Missed boarding, Unverified pickup, Vehicle change |

### Step 2 — Safe resolution

Follow the school’s approved emergency protocol.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Resolution and verified handoff reference (`resolution`) | textarea | Yes | No prefilled user content |

### Confirm and outcome

An accountable trip exception is recorded and escalated where needed.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

Never confirm an unverified handoff; minimize live location exposure.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Disconnected device or uncertain event preserves pending status and uses the approved human fallback.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

Trip and BoardingEvent append; route/vehicle changes reviewed; Communication uses minimal authorized notices.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
