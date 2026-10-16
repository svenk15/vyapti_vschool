# LEA-30 — Recuse and route a conflict of interest

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Each decision owner. This names responsibility, not proof that an owner module exists.
- Product decisions: D03. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F03. See execution queue.
- Reference: approved Principal catalogue LEA-30; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/decisions/:owner/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
Self/requester/subject conflict disables decision. Recusal reason uses fixed category plus optional bounded note; source steward assigns independent eligible reviewer. Original reviewer receives safe handoff receipt, not continued case access.

## Lifecycle, data and ownership
Recusal and assignment-change event appended atomically; if no eligible reviewer, UNASSIGNED/NEEDS_ROUTING remains with steward.

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
- WF-30-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-30-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-30-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-30-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-30-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Switching workspaces or granting another role cannot bypass self-approval prohibition.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Recuse and route a conflict of interest
**Delivery:** phase 2 · Later
**Trigger:** Principal is the requester, subject or otherwise prohibited decision maker.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Source-owner separation-of-duty policy and independent eligible escalation role.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Detect or declare a conflict. | Decision controls are unavailable where policy prohibits self-approval. |
| 2 | Principal | Choose permitted independent route. | Recipient is eligible and not selected from a public directory. |
| 3 | Principal | Record minimal recusal reason. | Confidential allegation details stay restricted. |
| 4 | System / owner | Track reassignment status. | Original principal does not gain continuing case access from routing it. |

**Inputs and validation**

- **Conflict category:** Owner allowlist plus bounded optional note.
- **Recipient:** Policy-defined independent role/person.

**Outcome:** Independent authorized decision ownership.
**Authorization:** No self-delegation trick or role switch to bypass separation of duties.
**Data read:** Assignment and conflict rules; eligible independent roles.
**Data written:** Source-owner recusal/reassignment event.

**Alternate and failure paths**

- No eligible approver: retain pending state and route to designated steward.
- Complaint is about principal: confidential route avoids sending narrative back to subject.

**Demo acceptance:** Requester cannot approve own prohibited item through alternate workspace.
