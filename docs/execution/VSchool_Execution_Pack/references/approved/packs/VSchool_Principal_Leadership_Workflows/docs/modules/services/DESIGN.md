# Financial & service oversight — DESIGN

Owner: Finance / individual service owners. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-43 — Review financial exceptions under a separate grant
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


## LEA-44 — Coordinate a school service interruption
**Delivery:** phase 6 · Later
**Trigger:** Transport, library, facilities or another enabled service reports an operational issue.
**Actors:** Principal; authorized Finance / individual service owners owner
**Preconditions:** Specific service released, operational oversight grant and current incident owner.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open the affected service notice. | See scope, published impact and safe last update. |
| 2 | Principal | Coordinate with responsible service team. | Assign an action without inheriting specialist permissions. |
| 3 | Principal | Approve a targeted communication only if delegated. | Audience and facts verified by source owner. |
| 4 | System / owner | Verify restoration using owner evidence. | Resolution, communication delivery and pending follow-ups remain separate. |

**Inputs and validation**

- **Service/scope:** Exact branch and affected period.
- **Owner/due:** Eligible service coordinator.
- **Update:** Published facts; no speculative arrival time or live tracking promise.

**Outcome:** Owned service response and verified update.
**Authorization:** Operational service summary does not expose passenger addresses, driver private data or full case records.
**Data read:** Service incident/status projection and current assignee.
**Data written:** Service-owner coordination action and approved notice.

**Alternate and failure paths**

- No telemetry: do not invent live vehicle location.
- Restricted safety/health content routes separately.

**Demo acceptance:** Restored service does not automatically mark all recipients informed.
