# LEA-21 — Perform an explicitly delegated moderation decision

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Assessments. This names responsibility, not proof that an owner module exists.
- Product decisions: D11. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F11,F03. See execution queue.
- Reference: approved Principal catalogue LEA-21; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/assessments/moderation/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Delegated independent moderator reviews exact subject/cohort/scale and submitted mark revision. Approve, return or reject with reason; author/mark recorder cannot moderate own submission via another workspace.

## Lifecycle, data and ownership
DRAFT → SUBMITTED → APPROVED/RETURNED/REJECTED; editing returned work creates next revision and invalidates old approval.

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
- WF-21-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-21-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-21-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-21-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-21-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Concurrent mark revision invalidates review digest; moderation never publishes a report.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Perform an explicitly delegated moderation decision
**Delivery:** phase 4 · Later
**Trigger:** Assessment owner assigns a moderation item to the principal.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Distinct moderation grant; conflict-of-interest rule and current evidence version.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open assigned moderation item. | View only permitted mark/rubric evidence and recorded checks. |
| 2 | Principal | Declare conflict or request missing information. | No self-approval of own prohibited work. |
| 3 | Principal | Review approve/reject/return consequences. | Reason and impact preview use the owner contract. |
| 4 | System / owner | Confirm through Assessment owner. | Versioned decision receipt; result publication remains separate. |

**Inputs and validation**

- **Decision:** Only currently allowed transitions.
- **Reason:** Required where policy mandates; returned items need actionable explanation.
- **Evidence version:** Server rechecked.

**Outcome:** One attributable moderation decision.
**Authorization:** Moderation and result publication are separate grants.
**Data read:** Assigned assessment decision and permitted evidence.
**Data written:** Assessment-owned moderation command, receipt and audit.

**Alternate and failure paths**

- Changed marks or assignment after preview: conflict, re-review.
- Unknown response: status check before a new intent.

**Demo acceptance:** Decision inbox cannot bypass the assessment owner’s guards.
