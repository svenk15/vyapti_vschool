# LEA-33 — Approve or return a proposed communication

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Communication. This names responsibility, not proof that an owner module exists.
- Product decisions: D03,D13. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F10,F03. See execution queue.
- Reference: approved Principal catalogue LEA-33; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/notices/review/:id`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe W from 04_PRODUCTION_UX.md.

## Target product definition
Independent assigned reviewer approves exact notice revision or returns/rejects with reason. Approval and publish are distinct capabilities and separate receipts; publication rechecks authorizations and audience.

## Lifecycle, data and ownership
Immutable reviewed revision; edits produce new version. Reviewer may publish only with separate publisher authority, never by approval implication.

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
- WF-33-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-33-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-33-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-33-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-33-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Approved revision2 cannot authorize publication of revision3 or newly added attachment.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Approve or return a proposed communication
**Delivery:** phase 2 · Later
**Trigger:** A staff-authored notice is awaiting delegated review.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Assigned reviewer, permitted content/audience and publication policy.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the exact draft revision. | Show intended audience, author, channels and schedule. |
| 2 | Principal | Review accuracy, clarity and required permissions. | Flag confidential content in broad communication. |
| 3 | Principal | Approve or return with actionable changes. | Versioned owner command; author may need to resubmit changed content. |
| 4 | System / owner | Inspect actual release state. | Approval is separate from scheduled publication and delivery. |

**Inputs and validation**

- **Decision:** Approve/return/reject per policy.
- **Reason:** Required for return; bounded and actionable.
- **Revision:** Exact reviewed content/audience version.

**Outcome:** Approved version or clear revision request.
**Authorization:** Only current delegated publishing/approval authority can act.
**Data read:** Notice draft version, audience preview and approval rule.
**Data written:** Communication approval state/receipt; publication follows owner contract.

**Alternate and failure paths**

- Author edits during approval: conflict, re-review.
- Self-approval prohibited by school rule: independent reviewer.

**Demo acceptance:** Approval of version 2 cannot publish unseen version 3.
