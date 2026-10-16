# LEA-26 — Hand over open work when leadership changes

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Coordination + Access. This names responsibility, not proof that an owner module exists.
- Product decisions: D02,D03. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F02,F04. See execution queue.
- Reference: approved Principal catalogue LEA-26; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/handover`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Preview up to 50 explicit eligible open items. Transfer per item to currently eligible successor. Show restricted/untransferable work as safe counts only where authorized; route to designated steward. Access revoke is separate, never waits for transfer to succeed.

## Lifecycle, data and ownership
Durable batch outcomes reuse replay semantics; original assignment history retained. Revocation can leave a safe steward queue but never prolong old access.

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
- WF-26-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-26-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-26-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-26-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-26-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Partial handover does not block urgent access revocation or grant successor hidden case access.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Hand over open work when leadership changes
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Principal/delegate leaves, delegation expires or responsibilities change.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Authorized handover coordinator; recipient grants verified independently.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | List transferable open work in permitted scope. | Separate operational actions from confidential cases and source-owner decisions. |
| 2 | Principal | Preview new eligible owners and retained evidence. | No access grant is bundled into reassignment. |
| 3 | Principal | Confirm reassignment by item. | Per-item version/eligibility and outcomes recorded. |
| 4 | System / owner | Retire old delegation through Access owner. | No orphaned live actions; inaccessible cases routed to specialist steward. |

**Inputs and validation**

- **Items:** Explicit bounded selection.
- **New owner:** Eligible for each purpose.
- **Effective time/reason:** Recorded in handover evidence.

**Outcome:** Traceable ownership transfer and access expiry.
**Authorization:** Reassignment cannot transfer private source access by implication.
**Data read:** Current open work, delegation expiry, current eligible assignees.
**Data written:** Versioned ownership events; separate Access delegation revoke.

**Alternate and failure paths**

- New owner lacks authority: item fails/awaits qualified owner.
- Unknown transfer result: reconcile, do not duplicate.

**Demo acceptance:** Old owner cannot act after revocation; new owner cannot read unrelated confidential material.

# Decisions & approvals
