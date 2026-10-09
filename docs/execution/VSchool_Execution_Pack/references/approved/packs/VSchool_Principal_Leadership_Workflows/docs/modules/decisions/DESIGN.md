# Decisions & approvals — DESIGN

Owner: Each owning module. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-27 — Work from a purpose-scoped decision inbox
**Delivery:** phase 2 · Second release
**Trigger:** Principal has requests awaiting their decision.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Source modules expose an authorized assigned-decision projection.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open My decisions. | Group by decision type, due time and action readiness. |
| 2 | Principal | Filter or sort using shared controls. | Counts reflect accessible items and current scope. |
| 3 | Principal | Open an item. | Owner-specific evidence, allowed actions and impact load fresh. |
| 4 | System / owner | Return to inbox. | Decided, awaiting information and unavailable items update distinctly. |

**Inputs and validation**

- **Filters:** Type, state, due period; no selected defaults.
- **Search:** Request reference or permitted subject.
- **Sort:** Due time or submitted time.

**Outcome:** One navigational inbox, with owner-specific decisions.
**Authorization:** Inbox read grant never authorizes decisions across every source module.
**Data read:** Authorized decision references and safe status projection only.
**Data written:** None.

**Alternate and failure paths**

- Source module disabled: no blind approve button.
- Stale list row: re-read source, do not trust cached action state.

**Demo acceptance:** Opening a decision calls its owner policy; unseen types cannot be acted upon.


## LEA-28 — Request information before deciding
**Delivery:** phase 2 · Later
**Trigger:** Evidence is incomplete or ambiguous.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Current decision assignment and a permitted communication channel.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Identify the missing information. | Choose targeted fields/questions; no unnecessary personal data. |
| 2 | Principal | Preview recipient and question. | Only authorized originator/team sees the request. |
| 3 | Principal | Confirm request for information. | Owner records Waiting for information and response expectation. |
| 4 | System / owner | Review response later. | Decision evidence version changes; prior review must be refreshed. |

**Inputs and validation**

- **Question:** Bounded actionable text.
- **Recipient:** Owner-approved requester/contact.
- **Response date:** Policy-defined, not an invented statutory deadline.

**Outcome:** An explicit pending-information state.
**Authorization:** Asking for information does not expand recipient or case permissions.
**Data read:** Decision version; current originator/participant grant.
**Data written:** Source-owner information request and approved message.

**Alternate and failure paths**

- Reply delivery fails: remains visible; no implied receipt.
- Request already resolved/reassigned: stale transition rejected.

**Demo acceptance:** Waiting for information is not Rejected or Approved.


## LEA-29 — Approve, reject or return an assigned item
**Delivery:** phase 2 · Later
**Trigger:** A complete item is ready for a delegated decision.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Owner exposes current valid actions and consequence preview.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review source facts and policy. | See subject, version, scope and relevant history. |
| 2 | Principal | Select decision and enter reason. | Reason requirements vary by source type. |
| 3 | Principal | Review the consequences and confirm. | One explicit command with stable intent and expected version. |
| 4 | System / owner | Read decision receipt. | Actor, time, outcome, source revision and downstream pending effects are distinct. |

**Inputs and validation**

- **Decision:** Source-defined allowed enum.
- **Reason:** Required where meaningful; no generic mandatory filler for every approval.
- **Intent/version:** Opaque server/adapter contract.

**Outcome:** One owner-confirmed decision.
**Authorization:** No generic approval table may become authority over all modules.
**Data read:** Owner decision item and policy/version.
**Data written:** Only the owning module changes business state; receipt/audit atomically recorded.

**Alternate and failure paths**

- Concurrent decision wins first: show current result; no overwrite.
- Transport timeout: Check decision status before retry.

**Demo acceptance:** Approved but payment/delivery pending cannot display Completed.


## LEA-30 — Recuse and route a conflict of interest
**Delivery:** phase 2 · Later
**Trigger:** Principal is the requester, subject or otherwise prohibited decision maker.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Source-owner separation-of-duty policy and independent eligible escalation role.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Detect or declare a conflict. | Decision controls are unavailable where policy prohibits self-approval. |
| 2 | Principal | Choose permitted independent route. | Recipient is eligible and not selected from a public directory. |
| 3 | Principal | Record minimal recusal reason. | Confidential allegation details stay restricted. |
| 4 | System / owner | Track reassignment status. | Original principal does not gain continuing case access from routing it. |

**Inputs and validation**

- **Conflict category:** Owner allowlist plus bounded optional note.
- **Recipient:** Policy-defined independent role/person.

**Outcome:** Independent authorized decision ownership.
**Authorization:** No self-delegation trick or role switch to bypass separation of duties.
**Data read:** Assignment and conflict rules; eligible independent roles.
**Data written:** Source-owner recusal/reassignment event.

**Alternate and failure paths**

- No eligible approver: retain pending state and route to designated steward.
- Complaint is about principal: confidential route avoids sending narrative back to subject.

**Demo acceptance:** Requester cannot approve own prohibited item through alternate workspace.


## LEA-31 — Recover an uncertain or outdated decision
**Delivery:** phase 2 · Second release
**Trigger:** A decision response is lost or evidence changes mid-review.
**Actors:** Principal; authorized Each owning module owner
**Preconditions:** Stable intent, expected version and authorized status use case exist.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Keep intent and show Confirmation pending. | Do not offer another different decision while unresolved. |
| 2 | Principal | Check status under current authorization. | Accepted receipt, still pending or verified not-found returned. |
| 3 | Principal | If evidence changed, reopen review. | Display new permitted state and require fresh confirmation. |
| 4 | System / owner | Resolve the original operation. | No duplicate downstream effect and no false failure label. |

**Inputs and validation**

- **Reference:** Original opaque intent key.
- **New decision:** Only after original status is known and current policy permits.

**Outcome:** Known, attributable outcome.
**Authorization:** Retry/replay/status endpoints apply the same current owner guard.
**Data read:** Command receipt plus current owner version.
**Data written:** Exact replay only; no new effect on duplicate.

**Alternate and failure paths**

- Stale replica absence is not proof of failure.
- Permission revoked: safe support reference only, no protected receipt body.

**Demo acceptance:** Lost response followed by status check returns one original decision.
