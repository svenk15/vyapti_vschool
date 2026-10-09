# Integrations — School Administrator design

Edition 01 · Owner mapping: integrations, tenancy · UX proposal; human review pending.

Review permitted connections and reconcile synchronization.

## Scope and shared rules

Use PRODUCT_SCOPE, UX_SYSTEM, ARCHITECTURE_HANDOFF and SCREEN_CONTRACTS as shared contracts. Capabilities named for later modules are proposed. The prototype uses synthetic memory state; the repository implementation must use actual owner use cases.

## Physical implementation readiness

Before coding, reconcile actual `vs_` tables, columns, foreign keys, indexes, scoped joins, guard order, token/delivery semantics, RLS status, migrations and tests in the owning repository LLD. This pack specifies UX and conceptual owner workflows; it does not invent completed physical schemas.

<a id="sa-61"></a>
## SA-61 — Review connection status and reconcile a sync

**Phase:** 3 · **Authority:** integration.read / integration.manage (delegated)

**Entry:** the Integrations workspace or its linked record. Prototype: `#/flow/SA-61`.

**Prerequisites:** integration secret / replay / sync design.

### Step 1 — Connection

Credentials remain in a secure store and never in the screen or audit.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Connection (`connection`) | select | Yes | Roster source, Approved email provider |
| Action (`action`) | select | Yes | Review status, Preview sync, Reconcile failed records |

### Step 2 — Review effects

Map source IDs and preview changes before committing.

| Field | Input | Required | Options / sample default |
|---|---|---|---|
| Reviewed sync reference (`reference`) | text | Yes | No prefilled user content |
| The target branch and permitted changes are correct. (`scope`) | checkbox | Yes | No prefilled user content |

### Confirm and outcome

A scoped synchronization run has reconciled per-record outcomes.

Review entered values, hide secrets and require an explicit final action. Store/query a durable request receipt in the actual implementation. An unknown acknowledgement is resolved before a new intent.

### Validation and state invariants

No unreviewed source overwrites; authenticated webhooks deduplicate and reauthorize.

Trim and bound human input using the owning value objects. The prototype uses limited illustrative fields; actual command validation must enforce every invariant in the repository LLD. Date ranges use the existing school-local `[from,to)` contract, except an explicitly inclusive report filter. Name/code exactness and case policy follow the current Bible. No arbitrary HTML or unrestricted file URLs.

### Failure and recovery

Unknown provider outcome, duplicate webhook and mapping conflict stay visible.

Network failure preserves safe input until authorization is lost. A stale write shows current state and requires review. After permission loss, clear protected drafts and return to an authorized context.

### Data workflow and ownership

IntegrationCredentialRef, SyncRun, WebhookReceipt and owner module commands. No direct writes to another module’s tables.

Reads must name organization and branch scope where applicable and return only the fields required by this purpose. Writes are owned by the domain module; safe audit, outbox and request receipt share the documented transaction. Domain history is not overwritten to make a UI action convenient.

### Screen acceptance

- Entry, populated/empty/loading/error states use shared page recipes and a meaningful primary action.
- Every field has a label, local error and keyboard path. Required steps cannot be skipped by Continue.
- Back/Continue are separate from Save draft and leave. Saving is enabled only after user input.
- Final confirmation names scope and impact; outcome links to the resulting record.
- Test revoked scope, stale version and the specific recovery path above.
