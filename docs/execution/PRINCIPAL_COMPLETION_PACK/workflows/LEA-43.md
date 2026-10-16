# LEA-43 — Review financial exceptions under a separate grant

## Identity and readiness
- Baseline: NOT_STARTED; human review PENDING.
- Owner: Finance. This names responsibility, not proof that an owner module exists.
- Product decisions: D17. Must be approved or satisfied by a newer accepted equivalent.
- Foundation dependencies: F15,F03. See execution queue.
- Reference: approved Principal catalogue LEA-43; locate its actual explorer trigger in HTML, do not invent a hash route.
- Proposed production route: `/leadership/finance/exceptions`. Reuse an existing equivalent route and preserve old links; this is not a claim it exists.
- Production composition: recipe L from 04_PRODUCTION_UX.md.

## Target product definition
Explicit financial aggregate read; currency and reconciliation status visible. Separate detail/approval limits required for any assigned concession/refund. First delivery is summary + handoff; financial decision completion requires ledger and independent approval groundwork.

## Lifecycle, data and ownership
Invoice/payment/allocation/refund/reconciliation are finance-owned immutable money events. Approval, initiated refund and settled refund remain distinct. No student debtor list from leadership role.

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
- WF-43-A: reconcile this delta with actual code and original source; update owning LLD with exact fields, interfaces, scope predicates, SQL constraints, read joins, write sets, replay and sequence.
- WF-43-B: implement missing owner domain/application/adapters and counterpart operations using existing module facades; forward migration only if needed.
- WF-43-C: implement route and recipe, source-to-result navigation and all real states. Compare against shared UX geometry and applicable explorer step semantics.
- WF-43-D: verify authorization, decisive scenario below, real PostgreSQL lifecycle/concurrency, browser journey and screenshots; extend non-destructive seed.
- WF-43-E: publish evidence and update matrix, including any partial scope and production restrictions. Human review remains PENDING.

## Decisive acceptance scenario
Duplicate provider callback never double settles; Principal without finance.approve cannot act through inbox.

## Demonstration and evidence
Use fictional personas with distinct proposer/reviewer when required, a second branch, a denied actor and a retained unknown-outcome fixture. Demonstrate source → role action → counterpart action → persisted receipt → reload. For read-only flows demonstrate populated/empty/unavailable and forbidden deep link. Add screenshots at 1440×1000 and 390×844, exact executable commit, commands/results and recorded deviations. No credentials in evidence or Git.

## Original supplied workflow contract
The following is copied from the user's approved-pack catalogue to preserve scope. It is not evidence of implementation. Where new recommendations refine an earlier proposal, record the D-ID override when approved; do not silently narrow this contract.

Review financial exceptions under a separate grant
**Delivery:** phase 5 · Later
**Trigger:** Authorized leader reviews a finance summary or assigned approval.
**Actors:** Principal; authorized Finance / individual service owners owner
**Preconditions:** Finance module released; explicit aggregate/detail/approval grants; finance policies independently designed.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open authorized finance summary. | Show exact currency, cutoff, reconciliation state and definition. |
| 2 | Principal | Inspect permitted exception or assigned decision. | No default pupil debtor list from principal role. |
| 3 | Principal | Hand off or decide within explicit limit/separation rules. | Adjustment, concession and refund commands remain finance-owned. |
| 4 | System / owner | Confirm actual financial outcome. | Approval, initiated payment/refund and reconciled settlement remain distinct. |

**Inputs and validation**

- **Period/currency:** Explicit; no combining unlike currencies.
- **Decision limit:** Finance policy, not UI-only.
- **Reason/evidence:** Owner-required and minimized.

**Outcome:** Authorized financial oversight or bounded decision.
**Authorization:** No automatic refunds, fee editing, payroll access or financial hardship disclosure.
**Data read:** Finance safe projections, assigned approval and ledger/reconciliation evidence.
**Data written:** Finance owner decision only if explicitly delegated.

**Alternate and failure paths**

- Unreconciled data is labelled; no false collection total.
- Requester/self-approver conflict routes independently.

**Demo acceptance:** A principal cannot approve a refund merely because it appears in an inbox.
