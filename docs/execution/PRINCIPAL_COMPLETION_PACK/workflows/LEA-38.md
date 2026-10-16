# LEA-38 — Follow the school’s urgent safety escalation procedure

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Restricted support + school configuration. This names responsibility, not proof that an owner module exists.
- Product decisions: D16. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F14. See execution queue.
- Reference: approved Principal catalogue LEA-38; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/support/urgent`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe D from 04_PRODUCTION_UX.md.

## Target product definition
Display versioned school-approved contact procedure and limits of portal monitoring. Human contacts responsible person outside ordinary queue; record minimal handoff afterward. No default break-glass, auto-diagnosis, blanket notification or invented emergency number.

## Lifecycle, data and ownership
Procedure DRAFT → PUBLISHED/RETIRED by trusted school policy steward. Handoff RECORDED → ACKNOWLEDGED; recording never claims assistance delivered.

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
- WF-38-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-38-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-38-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-38-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-38-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Missing configuration displays contact gap; saving handoff cannot display emergency response completed.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Follow the school’s urgent safety escalation procedure
**Delivery:** phase 6 · Later · Explicit scope extension
**Trigger:** An urgent safety concern is raised through an approved channel.
**Actors:** Principal; authorized Specialist support owner owner
**Preconditions:** Approved school procedure, authorized emergency roles and actual contact configuration.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Show the school’s urgent-contact instruction. | Ordinary software queue is not represented as continuously monitored. |
| 2 | Principal | Contact the designated responsible person through the approved process. | No autonomous notification to all staff or guardians. |
| 3 | Principal | Record minimum permitted handoff evidence after appropriate action. | Access remains need-to-know. |
| 4 | System / owner | Review restricted incident follow-up under owner policy. | Emergency access, if supported, is explicit, time-limited and independently reviewed. |

**Inputs and validation**

- **Handoff reference:** Minimum safe information.
- **Emergency access:** Not a default principal capability; reason/expiry/review required where designed.

**Outcome:** Human-led authorized safety handoff.
**Authorization:** No default break-glass, diagnosis or confidential case visibility.
**Data read:** Approved procedure/contact configuration and explicit emergency-role rules.
**Data written:** Restricted handoff/event only under incident owner.

**Alternate and failure paths**

- No configured procedure: show school contact gap, do not invent emergency policy.
- Complaint implicates a leader: use designated independent channel.

**Demo acceptance:** The portal never claims it has provided emergency assistance merely because a form was saved.

# Reports & accountability
