<!-- TT-01 contract -->
## TT-01 supersedes the timetable outline
For LEA-16, LEA-24, follow [Shared timetable workflows](../../timetable/WORKFLOWS.md), [physical LLD](../../timetable/LLD.md), [one task queue](../../timetable/TASKS.md) and [checkpoint](../../timetable/CURRENT_STATE.md). The timetable-specific outline below is retained as historical context; do not implement it as an independent queue. Other module workflows remain current. First release is a weekly cycle; two-week cycle remains future scope.

# Academic oversight — DESIGN

Owner: Academics + Learning + Assessments. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-16 — Review timetable conflicts and uncovered classes
**Delivery:** phase 3 · Later
**Trigger:** A class is uncovered or a published schedule changes.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Published recurring timetable and coverage owner; manual attendance sessions alone are insufficient.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open affected period and branch. | List published uncovered/conflicting occurrences with evidence. |
| 2 | Principal | Inspect the exact occurrence. | Show current assignment and impact without private staff absence reasons. |
| 3 | Principal | Route to timetable coordinator or open delegated cover action. | Eligible staff and conflict checks come from the owner. |
| 4 | System / owner | Confirm owner result. | Publication/version refreshes; related attendance remains separate. |

**Inputs and validation**

- **Period:** School dates and times.
- **Occurrence:** Exact published version.
- **Proposed action:** Owner-defined cover/change request.

**Outcome:** Resolved cover arrangement or a traceable coordination request.
**Authorization:** No general timetable-edit or attendance-mark authority from a principal role.
**Data read:** Published occurrences; dated teacher eligibility and assignment; conflict projection.
**Data written:** Owner-specific cover request/decision only.

**Alternate and failure paths**

- Concurrent timetable edit requires refreshed review.
- No eligible cover: show unresolved status and escalation, not an invented allocation.

**Demo acceptance:** Assigned substitute cannot clash with another occurrence; cancelled sessions remain traceable.


## LEA-17 — Review assignment completion with the right denominator
**Delivery:** phase 3 · Later
**Trigger:** Leader reviews work completion for a class or subject.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Learning oversight grant and published assignment audience/extension rules.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose class, subject and period. | Show expected learner-assignment pairs due by cutoff. |
| 2 | Principal | Open submitted, awaiting or excused group. | Latest accepted attempt per pair counts once; private drafts remain private. |
| 3 | Principal | Inspect permitted evidence and context. | Extensions and missing audience data are explicit. |
| 4 | System / owner | Create a scoped teaching follow-up if justified. | Action names class/task, owner and evidence goal; no bulk student penalty. |

**Inputs and validation**

- **Period/cutoff:** Explicit school time.
- **Population:** Published assignment audience as of documented snapshot.
- **Follow-up:** Optional, distinct from grade/discipline.

**Outcome:** Accurate completion review and an authorized educational next step.
**Authorization:** Default leadership oversight does not expose private drafts or all student response content.
**Data read:** Published assignment recipients; accepted attempts; extensions/excused policy.
**Data written:** Optional internal coordination action.

**Alternate and failure paths**

- Unavailable submission data is not non-completion.
- A second attempt does not count as a second pupil.

**Demo acceptance:** Extended/not-yet-due and excused pairs follow the documented denominator policy.


## LEA-18 — Review feedback awaiting return
**Delivery:** phase 3 · Later
**Trigger:** Accepted learner work has not received returned feedback within school policy.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Learning oversight and an approved turnaround definition; teacher draft privacy preserved.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Select period and subject. | Show accepted attempts awaiting student-facing feedback. |
| 2 | Principal | Inspect elapsed time and source policy. | Calendar/working-day basis and cutoff are visible. |
| 3 | Principal | Coordinate with the subject lead. | No private draft comments or automatic staff performance verdict. |
| 4 | System / owner | Track returned publication. | Fresh evidence supports follow-up verification. |

**Inputs and validation**

- **Turnaround rule:** Versioned school policy; no hidden hardcoded deadline.
- **Assignee:** Eligible subject coordinator.
- **Note:** Operational, not evaluative personal data.

**Outcome:** Clear feedback backlog with owned follow-up.
**Authorization:** Feedback oversight is separate from permission to read full learner work.
**Data read:** Accepted attempt timestamp; returned feedback publication timestamps/state.
**Data written:** Optional coordination record; no teacher feedback edits.

**Alternate and failure paths**

- Returned then withdrawn feedback is shown under owner policy, not counted as permanently delivered.
- Incomplete timestamps block unsupported average.

**Demo acceptance:** Teacher Save private draft does not clear Awaiting return.


## LEA-19 — Coordinate an evidence-based learning concern
**Delivery:** phase 3 · Later · Explicit scope extension
**Trigger:** A teacher or authorized academic review identifies a learning concern.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Approved learning-support purpose; school process and authorized coordinator.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Review permitted task/assessment evidence. | Describe observable facts, not a diagnosis or predictive score. |
| 2 | Principal | Choose an educational follow-up. | Owner, review date and intended improvement are explicit. |
| 3 | Principal | Include family/student only through authorized channels. | Relationship and communication purposes rechecked. |
| 4 | System / owner | Review progress against agreed evidence. | Close or revise the support action; private specialist records remain separate. |

**Inputs and validation**

- **Concern:** Factual, bounded description.
- **Evidence:** Permitted published/returned source references.
- **Review date:** Explicit; no indefinite unresolved action.

**Outcome:** Human-owned learning support with a review checkpoint.
**Authorization:** No automatic mental-health inference, grading change or disciplinary action.
**Data read:** Authorized learning evidence and minimal student/class context.
**Data written:** Restricted educational follow-up only; separate specialist referral if needed.

**Alternate and failure paths**

- Sensitive care concern routes to the specialist workspace.
- No access to evidence: assign authorized reviewer without exposing it.

**Demo acceptance:** General school dashboards never reveal confidential support narrative.


## LEA-20 — Check assessment and report readiness
**Delivery:** phase 4 · Later
**Trigger:** School approaches a report publication milestone.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Assessment readiness projection and explicit branch oversight grant.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Choose assessment cycle. | Show configured requirements and source cutoff. |
| 2 | Principal | Inspect missing marks, unresolved outcomes or pending moderation. | Different readiness blockers remain distinct. |
| 3 | Principal | Assign coordination to the responsible owner. | No fabricated marks or implicit publication rights. |
| 4 | System / owner | Recheck owner evidence. | Ready means prerequisites satisfied, not Published. |

**Inputs and validation**

- **Cycle:** Exact scheme/version.
- **Readiness rule:** Owner-defined; optional assessments labelled.
- **Coordinator:** Eligible assessment lead.

**Outcome:** An explainable readiness checklist and remaining blockers.
**Authorization:** Leadership read does not imply mark entry, moderation approval or publication.
**Data read:** Assessment scheme; outcome completeness; moderation state; publication prerequisites.
**Data written:** Coordination actions only unless separately delegated.

**Alternate and failure paths**

- Absent, Exempt and Not entered cannot collapse into numeric zero.
- Revised scheme invalidates stale readiness snapshot.

**Demo acceptance:** 100% readiness cannot be displayed while a mandatory outcome is unresolved.


## LEA-21 — Perform an explicitly delegated moderation decision
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


## LEA-22 — Authorize or hand off report publication
**Delivery:** phase 4 · Later
**Trigger:** Reports are approved and ready for release.
**Actors:** Principal; authorized Academics + Learning + Assessments owner
**Preconditions:** Explicit publication delegation, audience and required separation of duties.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Inspect exact approved report version and audience. | Show release date, affected population and unresolved blockers. |
| 2 | Principal | Preview permitted publication effects. | No default all-branch or all-family audience. |
| 3 | Principal | Publish only if explicitly authorized; otherwise hand off. | Fresh prerequisites and conflict rules rechecked. |
| 4 | System / owner | Inspect owner publication receipt and delivery status. | Published is distinct from every recipient having received/read it. |

**Inputs and validation**

- **Version:** Exact immutable approved publication.
- **Audience:** Purpose-authorized student/guardian recipients.
- **Release time:** Explicit timezone and owner scheduling policy.

**Outcome:** Owner-confirmed publication or a pending handoff.
**Authorization:** Principal role alone cannot publish or access all guardian recipients.
**Data read:** Report readiness; approved version; authorized publication audience.
**Data written:** Assessment publication command and approved communication handoff.

**Alternate and failure paths**

- Duplicate publish returns same result.
- Post-publication correction uses new revision/withdrawal policy, not silent overwrite.

**Demo acceptance:** Stale or unapproved report cannot be published.
