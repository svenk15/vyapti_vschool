# LEA-44 — Coordinate a school service interruption

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Services + Coordination + Communication. This names responsibility, not proof that an owner module exists.
- Product decisions: D18. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F16,F04,F10. See execution queue.
- Reference: approved Principal catalogue LEA-44; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/services/incidents/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
First concrete service: Facilities. Authorized operator records affected facility/time and factual impact, assigns responsible team, updates restoration evidence. Principal coordinates and may separately publish permitted notice. Transport/library integrations remain explicitly unimplemented until owners exist.

## Lifecycle, data and ownership
OPEN → INVESTIGATING → RESTORATION_PROPOSED → VERIFIED_RESTORED → CLOSED; independent verification of restoration, notices retain own delivery state.

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
- WF-44-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-44-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-44-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-44-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-44-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Restoration cannot auto-acknowledge family notice; hidden transport records cannot appear through service generic IDs.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Coordinate a school service interruption
**Delivery:** phase 6 · Later
**Trigger:** Transport, library, facilities or another enabled service reports an operational issue.
**Actors:** Principal; authorized Finance / individual service owners owner
**Preconditions:** Specific service released, operational oversight grant and current incident owner.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the affected service notice. | See scope, published impact and safe last update. |
| 2 | Principal | Coordinate with responsible service team. | Assign an action without inheriting specialist permissions. |
| 3 | Principal | Approve a targeted communication only if delegated. | Audience and facts verified by source owner. |
| 4 | System / owner | Verify restoration using owner evidence. | Resolution, communication delivery and pending follow-ups remain separate. |

**Inputs and validation**

- **Service/scope:** Exact branch and affected period.
- **Owner/due:** Eligible service coordinator.
- **Update:** Published facts; no speculative arrival time or live tracking promise.

**Outcome:** Owned service response and verified update.
**Authorization:** Operational service summary does not expose passenger addresses, driver private data or full case records.
**Data read:** Service incident/status projection and current assignee.
**Data written:** Service-owner coordination action and approved notice.

**Alternate and failure paths**

- No telemetry: do not invent live vehicle location.
- Restricted safety/health content routes separately.

**Demo acceptance:** Restored service does not automatically mark all recipients informed.

# Reviewed leadership assistance
