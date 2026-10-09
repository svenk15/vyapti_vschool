# Staff coordination — DESIGN

Owner: People + Timetable + Requests. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-23 — Review staffing availability without private reasons
**Delivery:** phase 3 · Later
**Trigger:** Principal checks whether the school day can be covered.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** People/timetable availability projection; purpose-specific leadership grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose date and branch. | Show available/unavailable and relevant assignment coverage. |
| 2 | Principal | Open an uncovered occurrence. | No medical, payroll or private leave narrative. |
| 3 | Principal | Coordinate with eligible staff owner. | Availability is advisory until assignment conflict checks pass. |
| 4 | System / owner | Recheck published cover result. | Operational gap is resolved by owner evidence. |

**Inputs and validation**

- **Date:** School-local date.
- **Availability detail:** Minimum needed for cover.
- **Action:** Coverage coordination, not staff-performance scoring.

**Outcome:** Operational staffing view.
**Authorization:** Availability oversight is not full HR-record access.
**Data read:** People safe availability projection; dated teaching assignments.
**Data written:** Optional cover request only.

**Alternate and failure paths**

- Missing availability data shown Unknown.
- A staff member working another branch is not presumed free.

**Demo acceptance:** Private leave reason cannot appear in a list, export or notification.


## LEA-24 — Approve temporary cover when delegated
**Delivery:** phase 3 · Later
**Trigger:** Timetable coordinator proposes substitute coverage.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Delegated cover approval; verified teacher eligibility and time overlap checks.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review proposed teacher, occurrence and effective period. | See alternatives and impact allowed by owner. |
| 2 | Principal | Check current eligibility and conflicts. | No assumption that any staff account can teach. |
| 3 | Principal | Approve, return or reject with reason. | Current source versions and separation rules checked. |
| 4 | System / owner | Confirm published dated assignment. | Teacher access derives from that assignment, not principal notification. |

**Inputs and validation**

- **Occurrence/version:** Exact class/time.
- **Substitute:** Eligible active teacher.
- **Decision/reason:** Owner policy.

**Outcome:** Valid time-bounded cover assignment or explicit rejection.
**Authorization:** Approver cannot create teacher identity or bypass eligibility.
**Data read:** Occurrence; verified teacher identity/eligibility; dated assignment overlap.
**Data written:** Timetable owner command and audit.

**Alternate and failure paths**

- Teacher becomes ineligible before commit: deny.
- Teacher/date overlap: reject rather than double-book.

**Demo acceptance:** Expired cover grants no continued marking authority.


## LEA-25 — Decide an assigned staff request
**Delivery:** phase 6 · Later
**Trigger:** A leave/resource/staff request reaches an authorized approver.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Request type is released; principal explicitly assigned and permitted.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open assigned request. | Minimal purpose-specific detail and policy are shown. |
| 2 | Principal | Inspect operational impact and conflicts. | Sensitive attachments require separate access. |
| 3 | Principal | Choose an allowed decision or request information. | Review reason and consequence. |
| 4 | System / owner | Commit through the request owner. | Receipt shows decision; downstream roster/payroll actions keep their own state. |

**Inputs and validation**

- **Request type:** Existing allowed owner category.
- **Decision:** Per-type transition allowlist.
- **Reason:** Required for refusal/return when policy says so.

**Outcome:** Attributed staff-request decision.
**Authorization:** No blanket HR, salary or medical authority.
**Data read:** Assigned request; policy/version; permitted operational impact.
**Data written:** People/service request decision only.

**Alternate and failure paths**

- Principal is requester or has a prohibited conflict: route to independent approver.
- Approval does not automatically update payroll or timetable.

**Demo acceptance:** Same inbox cannot approve a type the principal is not delegated for.


## LEA-26 — Hand over open work when leadership changes
**Delivery:** phase 2 · Later · Explicit scope extension
**Trigger:** Principal/delegate leaves, delegation expires or responsibilities change.
**Actors:** Principal; authorized People + Timetable + Requests owner
**Preconditions:** Authorized handover coordinator; recipient grants verified independently.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | List transferable open work in permitted scope. | Separate operational actions from confidential cases and source-owner decisions. |
| 2 | Principal | Preview new eligible owners and retained evidence. | No access grant is bundled into reassignment. |
| 3 | Principal | Confirm reassignment by item. | Per-item version/eligibility and outcomes recorded. |
| 4 | System / owner | Retire old delegation through Access owner. | No orphaned live actions; inaccessible cases routed to specialist steward. |

**Inputs and validation**

- **Items:** Explicit bounded selection.
- **New owner:** Eligible for each purpose.
- **Effective time/reason:** Recorded in handover evidence.

**Outcome:** Traceable ownership transfer and access expiry.
**Authorization:** Reassignment cannot transfer private source access by implication.
**Data read:** Current open work, delegation expiry, current eligible assignees.
**Data written:** Versioned ownership events; separate Access delegation revoke.

**Alternate and failure paths**

- New owner lacks authority: item fails/awaits qualified owner.
- Unknown transfer result: reconcile, do not duplicate.

**Demo acceptance:** Old owner cannot act after revocation; new owner cannot read unrelated confidential material.
