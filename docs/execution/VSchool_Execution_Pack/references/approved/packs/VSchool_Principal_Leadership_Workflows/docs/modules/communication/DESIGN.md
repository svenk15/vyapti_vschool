# Communication & family escalations — DESIGN

Owner: Communication + Requests. Product proposal, not implementation evidence. Reconcile actual Bible, permission registry, source-owner LLD and schema first.

## LEA-32 — Prepare a targeted school notice
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


## LEA-33 — Approve or return a proposed communication
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


## LEA-34 — Follow up delivery or acknowledgement gaps
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


## LEA-35 — Handle an escalated family concern or complaint
**Delivery:** phase 2 · Later
**Trigger:** A school request reaches the principal under escalation policy.
**Actors:** Principal; authorized Communication + Requests owner
**Preconditions:** Explicit case purpose and independent route for conflicts.

| Step | Actor | Action | Visible result |
|---|---|---|---|
| 1 | Principal | Open only assigned, permitted case evidence. | See concern, timeline, desired outcome and authorized participants. |
| 2 | Principal | Acknowledge receipt through approved channel. | Do not promise a decision or confidentiality the school cannot guarantee. |
| 3 | Principal | Assign investigation/review to eligible owner. | Need-to-know access, action dates and participant boundaries set. |
| 4 | System / owner | Review owner finding and communicate permitted outcome. | Appeal/reopen route follows school policy; restricted notes stay private. |

**Inputs and validation**

- **Category/urgency:** Factual school-defined classification.
- **Owner/review date:** Eligible person and explicit checkpoint.
- **Outcome message:** Student/family-safe version, separate from internal notes.

**Outcome:** Owned, trackable resolution process.
**Authorization:** Leadership hierarchy does not grant all case content.
**Data read:** Assigned request/case; permitted timeline and relationship-purpose participant grants.
**Data written:** Case-owner coordination and public outcome events; controlled communication.

**Alternate and failure paths**

- Complaint concerns principal: route independently without revealing narrative to implicated user.
- Another guardian lacks purpose: not added automatically.
- Urgent safety issue: invoke designated school protocol, not ordinary queue promises.

**Demo acceptance:** General home, search, export and audit omit restricted complaint narrative.


## LEA-36 — Run a family or staff meeting with follow-up actions
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
