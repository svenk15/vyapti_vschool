# LEA-36 — Run a family or staff meeting with follow-up actions

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Events + Coordination. This names responsibility, not proof that an owner module exists.
- Product decisions: D14. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F13,F04. See execution queue.
- Reference: approved Principal catalogue LEA-36; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/meetings/new`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Invite exact authorized staff/family participants to bounded meeting purpose. Agenda2000 chars; no private case notes in shared summary. Proposed/confirmed time, responses and actual completion distinct. Convert explicit agreed actions through Coordination.

## Lifecycle, data and ownership
DRAFT → PROPOSED → CONFIRMED → COMPLETED/CANCELLED. Individual response PENDING/ACCEPTED/DECLINED. Schedule change resets responses; one attendance record per participant, no inferred attendance from acceptance.

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
- WF-36-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-36-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-36-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-36-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-36-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Decline never marks meeting held; removed participant cannot read summary or linked cases.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Run a family or staff meeting with follow-up actions
**Delivery:** phase 3 · Later · Explicit scope extension
**Trigger:** A permitted discussion needs coordination.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Meeting scheduling scope approved; participant permissions and availability policy.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Define purpose and permitted participants. | No unrestricted contact search or hidden addition of guardians. |
| 2 | Principal | Propose/confirm a time and agenda. | Acceptance state distinct from invitation delivery. |
| 3 | Principal | Record agreed non-sensitive actions. | Each action has owner, due date and permitted evidence. |
| 4 | System / owner | Share authorized summary and review progress. | Private notes stay separate; closure uses actual results. |

**Inputs and validation**

- **Participants:** Current purpose-authorized identities.
- **Time:** Explicit timezone and availability.
- **Agenda/actions:** Bounded and visible only to intended participants.

**Outcome:** Confirmed meeting and accountable next steps.
**Authorization:** Meeting membership does not transfer access to full student/HR/case records.
**Data read:** Permitted participant references; meeting state; source action references.
**Data written:** Meeting owner and coordination records only.

**Alternate and failure paths**

- Declined invitation does not mean meeting occurred.
- A participant loses access: remove future visibility and recheck sharing.

**Demo acceptance:** Sharing the summary excludes private staff/case notes.

# Restricted student support
