# LEA-32 — Prepare a targeted school notice

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Communication + Documents. This names responsibility, not proof that an owner module exists.
- Product decisions: D13,D15. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F10,F12. See execution queue.
- Reference: approved Principal catalogue LEA-32; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/notices/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Draft bounded text for branch/class audiences with independent create/review/publish grants. Title120/body10000 characters; acknowledgement separate from consent. Text-only usable first, scanned attachment support required before claiming full attachment scope. Scheduling is optional, only when durable delivery lifecycle exists.

## Lifecycle, data and ownership
DRAFT → IN_REVIEW → APPROVED/RETURNED/REJECTED → PUBLISHED/WITHDRAWN. Approval digest includes content,audience,attachments,channel,schedule.

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
- WF-32-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-32-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-32-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-32-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-32-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Saving draft sends nothing; changed audience invalidates approval and recipient preview.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Prepare a targeted school notice
**Delivery:** phase 2 · Later
**Trigger:** Leadership needs to communicate a school update.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Draft/publish grants separate; recipient-purpose model active.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose purpose and allowed audience. | Preview branch/class/role and recipient count without exposing unnecessary contacts. |
| 2 | Principal | Write notice and permitted attachments. | Required acknowledgement is optional and distinct from consent. |
| 3 | Principal | Preview content, timing and audience. | School timezone, channels and changed recipient scope visible. |
| 4 | System / owner | Save draft or submit for approval/publish if granted. | No send until explicit authorized confirmation. |

**Inputs and validation**

- **Audience:** Explicit authorized groups; no default all-institution.
- **Title/body:** Bounded content; plain, action-oriented language.
- **Acknowledgement:** Explicit toggle with explanation.
- **Schedule:** Optional owner-supported future release.

**Outcome:** Prepared notice or owner-confirmed publication.
**Authorization:** Broadcast authority is separate from reading private family conversations.
**Data read:** Allowed audience rules; current recipient purposes; attachment scan state.
**Data written:** Communication draft/approval/publication via owner.

**Alternate and failure paths**

- Audience changes before send: regenerate preview.
- Not authorized to publish: draft/approval handoff, not hidden direct send.

**Demo acceptance:** No message is sent merely by selecting audience or saving a draft.
