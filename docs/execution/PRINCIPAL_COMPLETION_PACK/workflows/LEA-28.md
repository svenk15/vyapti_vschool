# LEA-28 — Request information before deciding

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Each decision owner. This names responsibility, not proof that an owner module exists.
- Product decisions: D03,D08. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F03. See execution queue.
- Reference: approved Principal catalogue LEA-28; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/decisions/:owner/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
Ask an actionable question of the source-approved requester, maximum 1000 characters and optional response date. Portal delivery first; recipient preview explicit. Answer supplied by authorized counterpart, no generic contact picker.

## Lifecycle, data and ownership
WAITING_INFORMATION is owner state or explicit child question; one open question per item; reply increments evidence version; closure/resolution cancels unanswered question.

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
- WF-28-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-28-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-28-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-28-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-28-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Former participant cannot respond; stale answer cannot overwrite an already decided item.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Request information before deciding
**Delivery:** phase 2 · Later
**Trigger:** Evidence is incomplete or ambiguous.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Current decision assignment and a permitted communication channel.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Identify the missing information. | Choose targeted fields/questions; no unnecessary personal data. |
| 2 | Principal | Preview recipient and question. | Only authorized originator/team sees the request. |
| 3 | Principal | Confirm request for information. | Owner records Waiting for information and response expectation. |
| 4 | System / owner | Review response later. | Decision evidence version changes; prior review must be refreshed. |

**Inputs and validation**

- **Question:** Bounded actionable text.
- **Recipient:** Owner-approved requester/contact.
- **Response date:** Policy-defined, not an invented statutory deadline.

**Outcome:** An explicit pending-information state.
**Authorization:** Asking for information does not expand recipient or case permissions.
**Data read:** Decision version; current originator/participant grant.
**Data written:** Source-owner information request and approved message.

**Alternate and failure paths**

- Reply delivery fails: remains visible; no implied receipt.
- Request already resolved/reassigned: stale transition rejected.

**Demo acceptance:** Waiting for information is not Rejected or Approved.
