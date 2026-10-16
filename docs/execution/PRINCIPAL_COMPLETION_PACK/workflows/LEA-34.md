# LEA-34 — Follow up delivery or acknowledgement gaps

## Identity and readiness
- Baseline: PARTIAL; human review PENDING.
- Owner: Communication. This names responsibility, not proof that an owner module exists.
- Product decisions: D13. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F10. See execution queue.
- Reference: approved Principal catalogue LEA-34; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/communication/:id/remind`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Preview current eligible unacknowledged recipients of exact publication when acknowledgement requested. In-app reminder first; manual resend email only with configured approved provider. No recipient names shown to aggregate-only Principal. One logical reminder per recipient/version/24h, max3, with explicit override out of scope.

## Lifecycle, data and ownership
Durable per-recipient reminder intent and delivery attempt; provider acceptance is not delivery/read/ack. Suppress before dispatch if revoked or now acknowledged. Unknown provider outcome reconciled, not blindly resent.

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
- WF-34-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-34-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-34-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-34-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-34-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Revoked recipient gets no reminder; retry does not duplicate accepted dispatch or increment acknowledgement.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Follow up delivery or acknowledgement gaps
**Delivery:** phase 2 · Later
**Trigger:** Important published notice has incomplete delivery or requested acknowledgement.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Purpose-scoped delivery/acknowledgement projection; manual resend policy.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open notice coverage. | Separate eligible audience, accepted sends, failed deliveries and explicit acknowledgements. |
| 2 | Principal | Inspect permitted failed/unacknowledged group. | Unread, unacknowledged and failed delivery are not synonyms. |
| 3 | Principal | Preview a targeted reminder/resend. | Current recipient grants and deduplication rechecked. |
| 4 | System / owner | Record per-recipient outcomes. | No repeated send to already excluded or successfully handled recipients. |

**Inputs and validation**

- **Notice/version:** Exact publication.
- **Reminder audience:** Explicit purpose-filtered subset.
- **Message:** Bounded context; no private case details.

**Outcome:** Honest delivery/acknowledgement follow-up.
**Authorization:** No visibility into another guardian’s private relationship restrictions.
**Data read:** Published recipient snapshot plus current grants; delivery attempts; explicit acknowledgements.
**Data written:** Approved manual reminder/send intent and safe outcomes.

**Alternate and failure paths**

- No acknowledgement requirement: do not manufacture an engagement deficit.
- Revoked guardian purpose: stop future contact under that purpose.

**Demo acceptance:** Delivery accepted does not increment acknowledgement count.
