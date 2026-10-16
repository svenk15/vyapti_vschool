# LEA-03 — Work under a temporary leadership delegation

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Access. This names responsibility, not proof that an owner module exists.
- Product decisions: D02. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F02. See execution queue.
- Reference: approved Principal catalogue LEA-03; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/delegations`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Trusted operator issues named branch/actions delegation to an active staff identity for at most 30 calendar days. No self-issue, onward delegation or wildcard. Acting badge shows scope and expiry. Revoke immediately; renewal creates a new grant.

## Lifecycle, data and ownership
Scheduled → effective → expired/revoked is derived from immutable window plus revocation; scope does not exceed issuer policy. Existing source capabilities remain independently required.

All operations inherit the common tenant/capability/module/live-authority and command-recovery contract in 03_SHARED_ARCHITECTURE.md. Read permission never implies mutation, export or sensitive-case permission. Counterpart actors need real working screens and owner commands, not a seeded happy-path substitute.

## Screen and interaction contract
1. Entry shows authorized branch, source scope and freshness. Start from normal navigation or an authorized contextual source link.
2. Load current owner projection; show unavailable independently from an empty valid result.
3. For a write, collect only the fields named in this definition/source contract, validate and show source/consequence review before final confirmation. Read-only views have no artificial confirmation.
4. Keep Back/Continue edits within authorized context; clear protected data on scope loss. No durable draft unless owner schema and lifecycle explicitly support it.
5. Final action binds expected version and stable intent. Timeout displays Check status. A stale response shows current versus attempted permitted values and requires fresh confirmation.
6. Outcome shows owner-confirmed state, scope, timestamp and permitted next action. Never equate approval, delivery, receipt, acknowledgement and completion.
7. Default screen states: loading, empty, unavailable, forbidden, validation, changed evidence, changed actor eligibility, unknown outcome, known receipt and revocation. Add workflow-specific states from the source below.

## Implementation tasks
- WF-03-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-03-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-03-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-03-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-03-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Expiry between review and commit denies the command; restoring another role never revives the expired delegation.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Work under a temporary leadership delegation
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Approved acting principal or deputy covers a defined period.
**Actors:** Delegator; acting leader; Access owner
**Preconditions:** School-approved delegation policy, eligible delegate and bounded grant management authority.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Delegator | Choose eligible colleague, branch, allowed actions and effective window. | Preview excludes authorities the delegator cannot delegate. |
| 2 | Authorized approver | Confirm purpose and expiry. | Access owner records a dated delegation. |
| 3 | Acting leader | Enter delegated workspace. | Visible Acting role, scope and expiry; no misleading permanent title. |
| 4 | System | Recheck expiry on every protected action. | Expired or revoked authority stops new decisions. |

**Inputs and validation**

- **Delegate:** Active eligible school staff identity.
- **Scope:** Specific actions/branch; no wildcard.
- **Window:** Starts before ends; maximum determined by approved policy.
- **Reason:** Bounded non-sensitive note.

**Outcome:** Time-limited delegated authority with clear accountability.
**Authorization:** Grant issuance and delegated operation are different capabilities; originator identity remains visible.
**Data read:** Access grant/delegation rules; active staff assignment.
**Data written:** Delegation through Access owner, safe audit, approved recipient notification if enabled.

**Alternate and failure paths**

- Self-delegation or privilege expansion: deny.
- Pending work outlives delegation: route to currently authorized owner.

**Demo acceptance:** Delegate cannot approve outside scope or after expiry; existing receipts remain attributable.
