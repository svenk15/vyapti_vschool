# AI assistance — School Administrator design

Edition 01 · Owner mapping: assistant · UX proposal; human review pending.

Review source-backed suggestions within existing permissions.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-63"></a>
## SA-63 — Review an AI-assisted explanation or draft

**Phase:** 7 · **Authority:** assistant.use + every source capability

**Entry:** the AI assistance workspace or its linked record. Prototype: `#/flow/SA-63`.

**Prerequisites:** source module permission contracts, provider / retrieval / evaluation gates.

### Step 1 — Choose an allowed task

The assistant retrieves only evidence already permitted to you.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Task (`task`) | select | Yes | Explain a permitted attendance report, Draft a school notice |
| Question / draft request (`question`) | textarea | Yes | No prefilled user content |

### Step 2 — Check sources

The answer must carry source references and an as-of time.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| I have checked the cited evidence and any uncertainty. (`sources`) | checkbox | Yes | No prefilled user content |

### Step 3 — Use a reviewed draft

Business changes still use normal authorized forms.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Next action (`next`) | select | Yes | Keep as a draft, Open the normal action form |

### Confirm and outcome

A reviewed draft or explanation can support a human decision.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No unrestricted SQL, autonomous record changes or sensitive health/disciplinary inference.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Missing evidence, provider outage and suspicious retrieved instructions trigger abstention or a safe fallback.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

AssistantSession, scoped EvidenceReference and ActionProposal; deterministic calculations from owner read contracts.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
