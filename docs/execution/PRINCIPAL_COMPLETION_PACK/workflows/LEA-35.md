# LEA-35 — Handle an escalated family concern or complaint

## Identity and readiness
- Current status: ENGINEERING_COMPLETE for the approved synthetic-only D12 lifecycle; human review PENDING.
- Evidence: `docs/evidence/principal-lea-35-lifecycle-2026-10-18/README.md`.
- Owner: Requests restricted cases. This names responsibility, not proof that an owner module exists.
- Product decisions: D12,D16. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F09,F03. See execution queue.
- Reference: approved Principal catalogue LEA-35; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/concerns/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
Only explicitly assigned case reviewer sees permitted complaint content. Originator sees public updates; internal notes separate. Complaint about reviewer routes to independent configured institution steward and excludes implicated accounts. No guardian auto-add.

## Lifecycle, data and ownership
SUBMITTED → ASSIGNED → WAITING_INFORMATION/UNDER_REVIEW → OUTCOME_ISSUED → CLOSED; appeal request routed independently within school-configured window, no invented legal deadline.

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
- WF-35-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-35-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-35-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-35-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-35-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Implicated Principal sees neither narrative nor existence through global counts/search/export.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Handle an escalated family concern or complaint
**Delivery:** phase 2 · Later
**Trigger:** A school request reaches the principal under escalation policy.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Explicit case purpose and independent route for conflicts.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open only assigned, permitted case evidence. | See concern, timeline, desired outcome and authorized participants. |
| 2 | Principal | Acknowledge receipt through approved channel. | Do not promise a decision or confidentiality the school cannot guarantee. |
| 3 | Principal | Assign investigation/review to eligible owner. | Need-to-know access, action dates and participant boundaries set. |
| 4 | System / owner | Review owner finding and communicate permitted outcome. | Appeal/reopen route follows school policy; restricted notes stay private. |

**Inputs and validation**

- **Category/urgency:** Factual school-defined classification.
- **Owner/review date:** Eligible person and explicit checkpoint.
- **Outcome message:** Student/family-safe version, separate from internal notes.

**Outcome:** Owned, trackable resolution process.
**Authorization:** Leadership hierarchy does not grant all case content.
**Data read:** Assigned request/case; permitted timeline and relationship-purpose participant grants.
**Data written:** Case-owner coordination and public outcome events; controlled communication.

**Alternate and failure paths**

- Complaint concerns principal: route independently without revealing narrative to implicated user.
- Another guardian lacks purpose: not added automatically.
- Urgent safety issue: invoke designated school protocol, not ordinary queue promises.

**Demo acceptance:** General home, search, export and audit omit restricted complaint narrative.
