# Messages & families — Teacher design

Edition 01 · First phase 2 · UX design proposal

Communicate through approved audiences and child-specific relationships.

Domain owner(s): communication, guardians. The teacher UI consumes these owners; it does not become a new shared-data owner. Resolve exact physical tables/capabilities against the current repository before coding.

## Common layout and states

Use the shared shell, typography, icons, context control, fluid Filter/Sort drawers and explicit outcomes from ../../UX_SYSTEM.md. All protected reads and commands recheck server scope. Include loading, empty, invalid input, permission loss, expired session, stale version and relevant unknown/delivery failure states. Keep institution/branch, school-local date and current assignment explicit.

## TEA-17 — Read school notices and acknowledge

Phase: 2 (Family connection). Reconcile the approved module scope before implementation.

Entry: `communication`. Required capability/condition: **communication.read for explicit audience**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Notice** — Open a notice addressed to this teacher.
   - Notice: `select`; required; choices: Term planning meeting, School calendar update.
2. **Acknowledge when requested** — Read, delivered and acknowledged are different states.
   - I acknowledge this notice.: `checkbox`; required.

### Outcome and domain invariant

A required acknowledgement records the teacher’s explicit action.

Do not infer acknowledgement from an opened page or email tracking. Attachments reauthorize.

### Failure and recovery

Edited/withdrawn notice or revoked audience membership has a safe update state.

### Data workflow and ownership

Communication published notice/version + RecipientSnapshot + explicit acknowledgement; access derived from live audience.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-18 — Prepare a class message

Phase: 2 (Family connection). Reconcile the approved module scope before implementation.

Entry: `communication/compose`. Required capability/condition: **communication.compose; send requires delegated scope**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Message** — Keep sensitive details out of notification previews.
   - Assigned class: `select`; required; choices: Grade 6 · A · Mathematics, Grade 6 · B · Mathematics, Grade 7 · A · Science.
   - Subject: `text`; required.
   - Message: `textarea`; required.
2. **Audience review** — Show eligible verified recipients and exclusions without exposing private family restrictions.
   - Audience: `select`; required; choices: Approved guardians of this class, Assigned school staff.
   - I have reviewed the intended audience.: `checkbox`; required.
3. **Submit for approval** — Direct send is available only when explicitly granted.
   - Action: `select`; required; choices: Send to authorized approver, Save draft.

### Outcome and domain invariant

A message draft or approval request has a visible status.

Teacher role is not a blanket send grant. Recheck relationship, purpose, consent and module access at actual delivery.

### Failure and recovery

Provider failure/unknown is distinct from sent/delivered. Revoked relationships are suppressed, not retried.

### Data workflow and ownership

Communication owns MessageCampaign, recipient snapshot and delivery attempts; Guardians supplies live purpose grants via a minimal contract.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-19 — Reply in a permitted family conversation

Phase: 2 (Family connection). Reconcile the approved module scope before implementation.

Entry: `communication/thread/t1`. Required capability/condition: **communication.reply + child/conversation grant**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Conversation context** — The family and child relationship is checked on every read.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Conversation: `select`; required; choices: Class learning question.
2. **Reply** — Use the approved conversation; do not reveal other children or private contact lists.
   - Reply: `textarea`; required.

### Outcome and domain invariant

A reply appears in the authorized thread with its actual delivery state.

No teacher-created guardian relationship or invitation. A household contact or payer is not automatically a portal guardian.

### Failure and recovery

Removed participant or revoked child grant prevents further disclosure; report safely to the school office.

### Data workflow and ownership

ConversationGrant/Message version references exact child and participants; queued delivery rechecks current grants.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-20 — Arrange a family meeting

Phase: 2 (Family connection). Explicit scope extension; approval/reconciliation required.

Entry: `flow/TEA-20`. Required capability/condition: **meeting.request within permitted family relationship (proposed)**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Purpose and participant** — Use a verified conversation or school-approved scheduling route.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Meeting topic: `text`; required.
   - Preferred date: `date`; required.
2. **Availability** — Share only offered times, not the teacher’s private calendar.
   - Time: `select`; required; choices: 15:30–15:45, 15:45–16:00.
   - Message to the family: `textarea`; required.

### Outcome and domain invariant

The request is proposed, confirmed, rescheduled or cancelled with an explicit participant response.

This scheduling extension needs approval and a conflict model before implementation. No student-sensitive detail in public calendars.

### Failure and recovery

Concurrent booking, cancellation, time-zone display and guardian revocation require clear recovery.

### Data workflow and ownership

Proposed MeetingRequest/SlotReservation with participant grants; Communication handles notices separately.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.

## TEA-21 — Review permitted absence context

Phase: 2 (Family connection). Reconcile the approved module scope before implementation.

Entry: `flow/TEA-21`. Required capability/condition: **attendance explanation read purpose; no default approval**. Capability strings are proposed design labels unless already present in the repository.

### Journey and field contract

1. **Student and date** — Read only the limited explanation permitted for teaching.
   - Student in assigned class: `select`; required; choices: Aarav Mehta · GW-26001, Diya Rao · GW-26002, Kabir Shah · GW-26003.
   - Session date: `date`; required.
2. **School handoff** — Review status does not itself alter the register.
   - Action: `select`; required; choices: View office-reviewed disposition, Refer a discrepancy to the school office.

### Outcome and domain invariant

The teacher gets necessary context while the school office controls disposition and correction.

No clinical attachment, private family dispute or guardian note unless explicitly authorized. No automatic absence inference.

### Failure and recovery

Pending explanation, late attendance, revoked relationship and unavailable detail are distinct.

### Data workflow and ownership

Minimal authorized explanation/request read model; Attendance correction and Guardian relationship owners remain separate.

Implement this path through the owning application use case and ports. Scope all referenced records; do not trust hidden form IDs or a client-supplied branch. Record actual table and join mapping in the owner’s schema worksheet. Preserve exact transaction/lock rules, version checks and sanitized evidence. Avoid logging form bodies or sensitive pupil content.

### Demo acceptance

Start with an authorized fictional teacher in Whitefield; execute the steps and show the stated outcome. Repeat with missing required input and the named recovery path. Attempt the same operation from an unauthorized branch/assignment and confirm no data disclosure or mutation. Check desktop/mobile composition, keyboard order and semantic outcome labels. A generic prototype review receipt is not backend evidence.
