# LEA-27 — Work from a purpose-scoped decision inbox

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Leadership aggregation + owner facades. This names responsibility, not proof that an owner module exists.
- Product decisions: D03. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F03. See execution queue.
- Reference: approved Principal catalogue LEA-27; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/decisions`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
One inbox aggregates only current assigned permitted owner projections. Filter by supported type/state/due; exact reference search default; stable sort due/submitted. Source owner declares allowed actions.

## Lifecycle, data and ownership
No universal approval business table. Typed reference includes owner, type, resource/version; failures isolated per owner with visible source availability.

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
- WF-27-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-27-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-27-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-27-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-27-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Manipulating owner/type cannot invoke another module decision; unreadable items absent from totals.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Work from a purpose-scoped decision inbox
**Delivery:** phase 2 · Second release
**Trigger:** Principal has requests awaiting their decision.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Source modules expose an authorized assigned-decision projection.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open My decisions. | Group by decision type, due time and action readiness. |
| 2 | Principal | Filter or sort using shared controls. | Counts reflect accessible items and current scope. |
| 3 | Principal | Open an item. | Owner-specific evidence, allowed actions and impact load fresh. |
| 4 | System / owner | Return to inbox. | Decided, awaiting information and unavailable items update distinctly. |

**Inputs and validation**

- **Filters:** Type, state, due period; no selected defaults.
- **Search:** Request reference or permitted subject.
- **Sort:** Due time or submitted time.

**Outcome:** One navigational inbox, with owner-specific decisions.
**Authorization:** Inbox read grant never authorizes decisions across every source module.
**Data read:** Authorized decision references and safe status projection only.
**Data written:** None.

**Alternate and failure paths**

- Source module disabled: no blind approve button.
- Stale list row: re-read source, do not trust cached action state.

**Demo acceptance:** Opening a decision calls its owner policy; unseen types cannot be acted upon.
