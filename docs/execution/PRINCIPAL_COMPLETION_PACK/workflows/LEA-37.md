# LEA-37 — Refer a concern to an authorized specialist

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Restricted support. This names responsibility, not proof that an owner module exists.
- Product decisions: D16. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F14. See execution queue.
- Reference: approved Principal catalogue LEA-37; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/support/referrals/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Configure school-approved specialist route and explicit referral grant. Select exact authorized pupil, factual concern and recipient; no diagnosis or broad case-history browsing. Referrer sees handoff status only after submission unless separately case-authorized.

## Lifecycle, data and ownership
DRAFT → SENT → ACKNOWLEDGED/RETURNED/CLOSED by specialist; receipt is not intervention or treatment. Protected narrative stored under restricted owner, excluded from broad audit.

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
- WF-37-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-37-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-37-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-37-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-37-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Referrer cannot open specialist case notes; wrong-route recipient never gains access.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Refer a concern to an authorized specialist
**Delivery:** phase 6 · Later
**Trigger:** A factual observation requires specialist support.
**Actors:** Principal; authorized Specialist support owner owner
**Preconditions:** School-defined referral channel and purpose grant; designated specialist service enabled.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Read allowed referral context. | Do not search for a broad student health/case history. |
| 2 | Principal | Record minimum factual concern. | Show who will receive it and the limits of this channel. |
| 3 | Principal | Route to designated specialist. | Receipt confirms referral, not diagnosis, intervention or accepted treatment. |
| 4 | System / owner | Track permitted handoff status only. | Case narrative and specialist notes remain restricted. |

**Inputs and validation**

- **Concern:** Observed facts, no automated diagnosis.
- **Recipient:** Designated specialist route.
- **Urgency:** School-defined routing, not automated medical triage.

**Outcome:** Restricted referral with an accountable recipient.
**Authorization:** Referral capability does not grant case-read or health-record access.
**Data read:** Minimal student identity/purpose context; authorized referral route.
**Data written:** Specialist referral and safe status evidence.

**Alternate and failure paths**

- Specialist channel unavailable: school-approved contact route shown.
- Principal lacks case access after referral: status-only projection if permitted.

**Demo acceptance:** No detailed health/support narrative appears in school-wide dashboard or analytics.
